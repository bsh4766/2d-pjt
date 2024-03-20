import {
  StyledCalendarWrapper,
  StyledCalendar,
  StyledDate,
  StyledToday,
  StyledDot,
} from "./CalendarStyle";
import Schedule from "./Schedule";
import { useState } from "react";
import moment from "moment";
import "moment/dist/locale/ko";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const MyCalendar = () => {
  const today = new Date();
  moment.locale("ko");
  const [date, setDate] = useState<Value>(today);
  const [activeStartDate, setActiveStartDate] = useState<ValuePiece>(
    new Date()
  );

  const attendDay = ["2024-03-01", "2024-05-02"];

  const handleDateChange = (newDate: Value) => {
    setDate(newDate);
  };

  const handleTodayClick = () => {
    const today = new Date();
    setActiveStartDate(today);
    setDate(today);
  };

  return (
    <>
      <div style={{ height: "7dvh" }}></div>
      <StyledCalendarWrapper>
        <StyledCalendar
          value={date}
          onChange={handleDateChange}
          formatDay={(_, date) => moment(date).format("D")}
          formatYear={(_, date) => moment(date).format("YYYY")}
          formatMonthYear={(_, date) => moment(date).format("YYYY. MM")}
          calendarType="gregory"
          showNeighboringMonth={false}
          next2Label={null}
          prev2Label={null}
          minDetail="year"
          // 오늘 날짜로 돌아오는 기능을 위해 필요한 옵션 설정
          activeStartDate={
            activeStartDate === null ? undefined : activeStartDate
          }
          onActiveStartDateChange={({ activeStartDate }) =>
            setActiveStartDate(activeStartDate)
          }
          // 오늘 날짜에 '오늘' 텍스트 삽입하고 출석한 날짜에 점 표시를 위한 설정
          tileContent={({ date, view }) => {
            const html = [];
            if (
              view === "month" &&
              date.getMonth() === today.getMonth() &&
              date.getDate() === today.getDate()
            ) {
              html.push(<StyledToday key={"today"}>오늘</StyledToday>);
            }
            if (view === "month") {
              if (
                attendDay.find((x) => x === moment(date).format("YYYY-MM-DD"))
              ) {
                html.push(
                  <StyledDot key={moment(date).format("YYYY-MM-DD")} />
                );
              }
            }
            return <>{html}</>;
          }}
        />
        <StyledDate onClick={handleTodayClick}>오늘</StyledDate>
      </StyledCalendarWrapper>
      <Schedule date={date || new Date()} attendDay={attendDay} />
    </>
  );
};

export default MyCalendar;
