import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import {
  Gantt,
  Task,
  EventOption,
  StylingOption,
  ViewMode,
  DisplayOption,
} from "gantt-task-react";
import { ViewSwitcher } from "./components/view-switcher";
import { getStartEndDateForProject, initTasks } from "./components/helper";
import "gantt-task-react/dist/index.css";
import { Popover } from "./components/Popover";

function App() {
  const [view, setView] = useState<ViewMode>(ViewMode.Day);
  const [tasks, setTasks] = useState<Task[]>(initTasks());
  const [isChecked, setIsChecked] = useState<boolean>(true);
  const lastDragTimeRef = useRef<number>(0);
  let columnWidth = 65;
  if (view === ViewMode.Year) {
    columnWidth = 350;
  } else if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  let timeStep = 86400000;
  // if (view === ViewMode.Week) {
  //   timeStep = 604800000;
  // } else if (view === ViewMode.Month) {
  //   timeStep = 2592000000;
  // } else if (view === ViewMode.Year) {
  //   timeStep = 31536000000;
  // }
  const headerHeight = 50;
  const arrowIndent = 20;

  const [popover, setPopover] = useState<{
    left: number;
    top: number;
    task: Task;
  } | null>(null);

  // 마우스 위치 추적
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      (window as any).lastMouseX = e.clientX;
      (window as any).lastMouseY = e.clientY;
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // 팝오버 외부 클릭 시 닫기 (다른 바 클릭은 onClick으로 새 팝오버가 열림)
  useEffect(() => {
    if (!popover) return;

    const handleDown = (e: MouseEvent) => {
      const pop = document.querySelector(".gantt-popover");
      if (pop && pop.contains(e.target as Node)) return;
      // 닫기만 하고 이벤트 전파는 유지 → 바 클릭 핸들러가 이어서 실행됨
      setPopover(null);
    };

    document.addEventListener("mousedown", handleDown, true);
    return () => document.removeEventListener("mousedown", handleDown, true);
  }, [popover]);

  const handleTaskChange = (task: Task) => {
    // 드래그/리사이즈로 날짜 변경 시각 기록
    lastDragTimeRef.current = Date.now();
    console.log("On date change Id:" + task.id);
    let newTasks = tasks.map((t) => (t.id === task.id ? task : t));
    if (task.project) {
      const [start, end] = getStartEndDateForProject(newTasks, task.project);
      const project =
        newTasks[newTasks.findIndex((t) => t.id === task.project)];
      if (
        project.start.getTime() !== start.getTime() ||
        project.end.getTime() !== end.getTime()
      ) {
        const changedProject = { ...project, start, end };
        newTasks = newTasks.map((t) =>
          t.id === task.project ? changedProject : t
        );
      }
    }
    setTasks(newTasks);
  };

  const handleTaskDelete = (task: Task) => {
    const conf = window.confirm("Are you sure about " + task.name + " ?");
    if (conf) {
      setTasks(tasks.filter((t) => t.id !== task.id));
    }
    return conf;
  };

  const handleProgressChange = async (task: Task) => {
    // 진행률 드래그 시각 기록
    lastDragTimeRef.current = Date.now();
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    console.log("On progress change Id:" + task.id);
  };

  const handleDblClick = (task: Task) => {
    alert("On Double Click event Id:" + task.id);
  };

  const handleClick = (task: Task) => {
    // 최근 드래그 이후 짧은 시간 내 클릭은 무시하여 팝오버가 열리지 않도록 처리
    if (Date.now() - lastDragTimeRef.current < 300) {
      return;
    }
    // 전역 마우스 위치 사용 (마지막 클릭 위치)
    const left = (window as any).lastMouseX || window.innerWidth / 2;
    const top = (window as any).lastMouseY || window.innerHeight / 2;

    setContentsDetail(
      JSON.stringify(
        {
          // id: task.id,
          "방 이름": task.roomName,
          "방 상태": task.roomStatus,
          "방 정보": task.roomInfo,
          "계약자 이름": task.contractName,
          "입금자 이름": task.depositName,
          "입실자 이름": task.enterName,
          "계약 정보": task.contractInfo,
          "계약 상태": task.contractStatus,
          "방 크기": task.roomSize,
          "방 타입": task.roomType,
          "계약 금액": task.contractAmount,
          "계약 시작일": task.start.toISOString(),
          "계약 종료일": task.end.toISOString(),
        },
        null,
        2
      )
    );

    setPopover({ left, top, task });
  };

  const handleSelect = (task: Task, isSelected: boolean) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    console.log("On expander click Id:" + task.id);
  };

  const favDialogRef = useRef<HTMLDialogElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [contentsDetail, setContentsDetail] = useState<string>("");

  const showDialog = () => {
    setPopover(null);
    const dialog = favDialogRef.current;
    if (dialog) {
      //   dialog.showModal();
      // 트랜지션을 위해 약간의 지연 후 open 속성 추가
      requestAnimationFrame(() => {
        dialog.showModal();
      });
    }
  };

  const closeDialog = () => {
    console.log(favDialogRef.current?.returnValue);
  };

  const confirmDialog = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // We don't want to submit this fake form
    const formData = new FormData(formRef.current ?? undefined);

    const value = formData.get("animal");
    favDialogRef.current?.close(value as string); // Have to send the select box value here.
  };

  return (
    <div className="dashboard">
      <main className="container">
        <h1>대시보드 (React SPA)</h1>
        <p className="subtitle">이 페이지는 React로 렌더링된 SPA입니다.</p>

        {/* <div className="dashboard-content">
          <div className="card">
            <h2>React 앱</h2>
            <p>정상적으로 로드되었습니다!</p>
          </div>

          <div className="card">
            <h2>React 컴포넌트</h2>
            <p>이 페이지는 완전한 React 애플리케이션입니다.</p>
            <Counter />
          </div>

          <div className="card">
            <h2>기능</h2>
            <ul>
              <li>React Hooks (useState)</li>
              <li>TypeScript 타입 안정성</li>
              <li>동적 UI 상호작용</li>
              <li>클라이언트 사이드 렌더링</li>
            </ul>
          </div>
        </div> */}

        <div className="card">
          <ViewSwitcher
            onViewModeChange={(viewMode) => setView(viewMode)}
            onViewListChange={setIsChecked}
            isChecked={isChecked}
          />
          <h3>Gantt With Unlimited Height</h3>
          <Gantt
            tasks={tasks}
            viewMode={view}
            viewDate={new Date()}
            onDateChange={handleTaskChange}
            onDelete={handleTaskDelete}
            onProgressChange={handleProgressChange}
            onDoubleClick={handleDblClick}
            onClick={handleClick}
            onSelect={handleSelect}
            onExpanderClick={handleExpanderClick}
            listCellWidth={isChecked ? "155px" : ""}
            columnWidth={columnWidth}
            locale="ko-KR"
            todayColor="#F4F0FB"
            barCornerRadius={8}
            headerHeight={headerHeight}
            arrowIndent={arrowIndent}
            timeStep={timeStep}
          />
        </div>
      </main>

      <dialog id="favDialog" ref={favDialogRef} onClose={closeDialog}>
        <form ref={formRef}>
          <pre>{contentsDetail}</pre>
          {/* <p>
            <label>
              Favorite animal:
              <select name="animal">
                <option value="default">Choose…</option>
                <option value="brine shrimp">Brine shrimp</option>
                <option value="red panda">Red panda</option>
                <option value="spider monkey">Spider monkey</option>
              </select>
            </label>
          </p> */}
          <div>
            <button value="cancel" formMethod="dialog">
              Cancel
            </button>
            <button id="confirmBtn" value="default" onClick={confirmDialog}>
              Confirm
            </button>
          </div>
        </form>
      </dialog>
      {popover && (
        <Popover left={popover.left} top={popover.top}>
          <ul>
            <li onClick={showDialog}>계약내용 상세보기</li>
            <li>예약금 요청 및 재요청</li>
            <li>보증금 입금일시 / 반환일시</li>
            <li>결제 및 정산 내역</li>
            <li>퇴실 처리</li>
            {/* <button onClick={() => setPopover(null)}>닫기</button> */}
          </ul>
        </Popover>
      )}
    </div>
  );
}

export default App;
