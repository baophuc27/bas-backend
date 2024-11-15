import { useQuery } from "common/hooks";
import { AlarmService } from "common/services/alarm.service";
import { decodePageData, notify } from "common/utils";
import i18next from "i18next";
import { first } from "lodash";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import swal from "sweetalert";

export const useList = () => {
  const { t, i18n } = useTranslation();
  const query = useQuery();
  const pageFilter = query.get("pageData")
    ? decodePageData(query.get("pageData"))
    : null;
  const [data, setData] = useState([]);
  const [page, setPage] = useState(+query.get("ppi") || 0);
  const [pageSize, setPageSize] = useState(+query.get("ps") || 5);

  const [valueType, setValueType] = useState(pageFilter?.type || "");
  const [valueAlarm, setValueAlarm] = useState(pageFilter?.alarmValue || "");
  const [valueBerth, setValueBerth] = useState(pageFilter?.berth || "");

  const [searchType, setSearchType] = useState(pageFilter?.type || "");
  const [searchAlarm, setSearchAlarm] = useState(pageFilter?.alarmValue || "");
  const [searchBerth, setSearchBerth] = useState(pageFilter?.berth || "");

  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState(pageFilter?.keyword || "");
  const [searchKeyword, setSearchKeyword] = useState(pageFilter?.keyword || "");

  const [exportLoading, setExportLoading] = useState(false);

  const { auth } = useSelector((state) => state?.user);
  const [sortModel, setSortModel] = useState([
    {
      field: "startTime",
      sort: "desc",
    },
  ]);

  const onPageSizeChange = (params) => {
    setPageSize(params?.pageSize);
    setPage(params?.page);
  };

  const onPageChange = (params) => {
    setPage(params?.page);
  };

  const onSortModelChange = (params) => {
    if (params.field === "berth") {
      params.field = i18next.language.includes("en")
        ? "berth.nameEn"
        : "berth.name";
    }
    setSortModel([
      {
        field: params?.field,
        sort: params?.sort,
      },
    ]);
  };

  const onDelete = (item) => {
    swal({
      title: t("alarm:dialog.delete_title"),
      text: t("alarm:dialog.delete_description"),
      icon: "warning",
      buttons: [t("common:button.no"), t("common:button.yes")],
    }).then((yes) => {
      if (yes) {
        deleteData(item?.id);
      }
    });
  };

  const onDeleteAll = () => {
    swal({
      title: t("alarm:dialog.delete_all_title"),
      text: t("alarm:dialog.delete_all_description"),
      icon: "warning",
      buttons: [t("common:button.no"), t("common:button.yes")],
    }).then((yes) => {
      if (yes) {
        AlarmService.deleteAll().then((res) => {
          if (res?.data?.success) {
            notify("success", t("alarm:messages.delete_all_success"));
            fetchData();
            return;
          }
          notify("error", t("alarm:messages.delete_all_error"));
        });
      }
    });
  };

  const onExportData = async () => {
    try {
      setExportLoading(true);
      const params = {
        page: page,
        amount: pageSize,
        search: searchKeyword,
        type: valueType,
        alarm: valueAlarm,
        berth: valueBerth,
        order: first(sortModel)?.field,
        mode: first(sortModel)?.sort?.toUpperCase(),
      };

      const res = await AlarmService.exportData(
        params,
        i18n?.language?.includes("en") ? "en" : "vi",
      );
      if (res?.status === 200) {
        const url = window.URL.createObjectURL(
          new Blob([res?.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }),
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `Alarmhistory_${moment().format("HH.MM.ss_DD.MM.YYY")}.xlsx`,
        );

        document.body.appendChild(link);
        link.click();
        link.remove();

        notify("success", t("record-management:dialog.export_success_message"));
        setExportLoading(false);
      }
    } catch (err) {
      notify("error", t("record-management:dialog.export_error_message"));
      console.log(err.response?.data?.message);
      setExportLoading(false);
    }
  };

  const onSubmit = () => {
    setPage(0);
    setPageSize(5);
    setSearchKeyword(keyword);
    setSearchType(valueType);
    setSearchAlarm(valueAlarm);
    setSearchBerth(valueBerth);
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const params = {
        page: page,
        amount: pageSize,
        search: searchKeyword,
        type: valueType,
        alarm: valueAlarm,
        berth: valueBerth,
        order: first(sortModel)?.field,
        mode: first(sortModel)?.sort?.toUpperCase(),
      };

      const resp = await AlarmService.getAll(params);

      if (resp?.data?.success) {
        setData({
          data: resp?.data?.data,
          total: resp?.data?.count,
        });
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteData = async (id) => {
    try {
      const resp = await AlarmService.deleteById(id);

      if (resp?.data?.success) {
        notify("success", t("alarm:messages.delete_success"));

        if (page > 0 && data?.data?.length === 1) {
          let newPage = page - 1;

          setPage(newPage);
        }

        fetchData();
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };

  const onReset = () => {
    setKeyword("");
    setSearchKeyword("");
    setValueType("");
    setValueAlarm("");
    setValueBerth("");
    setSearchType("");
    setSearchAlarm("");
    setSearchBerth("");
    setPage(0);
    setPageSize(5);
  };

  return {
    data,
    page,
    pageSize,
    loading,
    keyword,
    searchKeyword,
    sortModel,
    auth,
    onReset,
    onPageChange,
    onPageSizeChange,
    onDelete,
    onSubmit,
    fetchData,
    setKeyword,
    setSearchKeyword,
    onSortModelChange,
    valueType,
    setValueType,
    valueAlarm,
    setValueAlarm,
    valueBerth,
    setValueBerth,

    searchType,
    searchBerth,
    searchAlarm,

    onExportData,
    exportLoading,

    onDeleteAll,
  };
};
