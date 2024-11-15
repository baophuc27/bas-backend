import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import clsx from "clsx";
import { DATE_FORMAT } from "common/constants/date-time.constant";
import {
  addDays,
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import moment from "moment";
import React from "react";
import { useTranslation } from "react-i18next";
import { DateRangePicker } from "../mui-date-range-picker";
import classes from "./date-range-picker.style.module.css";

export const DateRangePickerComponent = (props) => {
  const { t } = useTranslation();
  const { className, left, minDate, maxDate } = props;
  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({});
  const [predefinedRanges, setPredefinedRanges] = React.useState([]);

  const toggle = () => setOpen(!open);

  const onChangeRange = (range) => {
    props["onChange"](range);

    setOpen(false);
  };

  const getDefaultRanges = (date) => [
    {
      label: t("common:date-range-picker.all"),
      startDate: null,
      endDate: null,
    },
    {
      label: t("common:date-range-picker.today"),
      startDate: date,
      endDate: date,
    },
    {
      label: t("common:date-range-picker.yesterday"),
      startDate: addDays(date, -1),
      endDate: addDays(date, -1),
    },
    {
      label: t("common:date-range-picker.this-week"),
      startDate: startOfWeek(date),
      endDate: endOfWeek(date),
    },
    {
      label: t("common:date-range-picker.last-week"),
      startDate: startOfWeek(addWeeks(date, -1)),
      endDate: endOfWeek(addWeeks(date, -1)),
    },
    {
      label: t("common:date-range-picker.last-7-days"),
      startDate: addWeeks(date, -1),
      endDate: date,
    },
    {
      label: t("common:date-range-picker.this-month"),
      startDate: startOfMonth(date),
      endDate: endOfMonth(date),
    },
    {
      label: t("common:date-range-picker.last-month"),
      startDate: startOfMonth(addMonths(date, -1)),
      endDate: endOfMonth(addMonths(date, -1)),
    },
  ];

  React.useEffect(() => {
    setDateRange(props["value"]);

    if (predefinedRanges.length === 0) {
      setPredefinedRanges(getDefaultRanges(new Date()));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props["value"]]);

  return (
    <div
      className={clsx(classes.dateRangePickerWrapper, className && className)}
    >
      {!props["isNormal"] ? (
        <>
          <div className={classes.dateRangePicker} onClick={toggle}>
            {dateRange["startDate"] && dateRange["endDate"] ? (
              <span className={classes.dateRangePickerValue}>
                {moment(dateRange["startDate"]).format(DATE_FORMAT)} -{" "}
                {moment(dateRange["endDate"]).format(DATE_FORMAT)}
              </span>
            ) : (
              <span>{t("common:date-range-picker.all")}</span>
            )}
            <span className={classes.dateRangePickerIcon}>
              <ArrowDropDownIcon />
            </span>
          </div>

          <div
            style={{
              position: "absolute",
              right: !left ? -34 : "unset",
              left: left || "unset",
              zIndex: "9999",
            }}
          >
            <DateRangePicker
              open={open}
              maxDate={maxDate}
              minDate={minDate}
              toggle={toggle}
              onChange={(range) => onChangeRange(range)}
              definedRanges={predefinedRanges}
              startDateLabel={t("common:date-range-picker.start-date")}
              endDateLabel={t("common:date-range-picker.end-date")}
              weekDaysLabels={[
                t("common:date-range-picker.sunday"),
                t("common:date-range-picker.monday"),
                t("common:date-range-picker.tuesday"),
                t("common:date-range-picker.wednesday"),
                t("common:date-range-picker.thursday"),
                t("common:date-range-picker.friday"),
                t("common:date-range-picker.saturday"),
              ]}
              monthsLabels={[
                t("common:date-range-picker.january"),
                t("common:date-range-picker.february"),
                t("common:date-range-picker.march"),
                t("common:date-range-picker.april"),
                t("common:date-range-picker.may"),
                t("common:date-range-picker.june"),
                t("common:date-range-picker.july"),
                t("common:date-range-picker.august"),
                t("common:date-range-picker.september"),
                t("common:date-range-picker.october"),
                t("common:date-range-picker.november"),
                t("common:date-range-picker.december"),
              ]}
            />
          </div>
        </>
      ) : (
        <DateRangePicker
          open
          onChange={(range) => onChangeRange(range)}
          maxDate={maxDate}
          minDate={minDate}
          toggle={toggle}
          definedRanges={predefinedRanges}
          startDateLabel={t("common:date-range-picker.start-date")}
          endDateLabel={t("common:date-range-picker.end-date")}
          weekDaysLabels={[
            t("common:date-range-picker.sunday"),
            t("common:date-range-picker.monday"),
            t("common:date-range-picker.tuesday"),
            t("common:date-range-picker.wednesday"),
            t("common:date-range-picker.thursday"),
            t("common:date-range-picker.friday"),
            t("common:date-range-picker.saturday"),
          ]}
          monthsLabels={[
            t("common:date-range-picker.january"),
            t("common:date-range-picker.february"),
            t("common:date-range-picker.march"),
            t("common:date-range-picker.april"),
            t("common:date-range-picker.may"),
            t("common:date-range-picker.june"),
            t("common:date-range-picker.july"),
            t("common:date-range-picker.august"),
            t("common:date-range-picker.september"),
            t("common:date-range-picker.october"),
            t("common:date-range-picker.november"),
            t("common:date-range-picker.december"),
          ]}
        />
      )}
    </div>
  );
};
