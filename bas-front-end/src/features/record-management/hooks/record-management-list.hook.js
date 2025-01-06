import { useQuery } from "common/hooks";
import { RecordManagementService, VesselService } from "common/services";
import { decodePageData, notify } from "common/utils";
import { first } from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

export const useRecordList = () => {
  const { t } = useTranslation();
  const query = useQuery();
  const navigate = useNavigate();
  const pageFilter = query.get("pageData")
    ? decodePageData(query.get("pageData"))
    : null;
  const [data, setData] = useState([]);
  const [page, setPage] = useState(+query.get("ppi") || 0);
  const [pageSize, setPageSize] = useState(+query.get("ps") || 5);

  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState(pageFilter?.keyword || "");
  const [searchKeyword, setSearchKeyword] = useState(pageFilter?.keyword || "");

  const [valueBerth, setValueBerth] = useState(pageFilter?.role || "");
  const [searchBerth, setSearchBerth] = useState(pageFilter?.role || "");

  const [valueVessel, setValueVessel] = useState(pageFilter?.vessel || "");
  const [searchVessel, setSearchVessel] = useState(pageFilter?.vessel || "");

  const [vessels, setVessels] = useState([]);

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
    setSortModel([
      {
        field: params?.field,
        sort: params?.sort,
      },
    ]);
  };

  const onDelete = (item) => {
    swal({
      title: t("record-management:dialog.delete_title"),
      text: t("record-management:dialog.delete_description", {
        fullName: item?.fullName,
      }),
      icon: "warning",
      buttons: [t("common:button.no"), t("common:button.yes")],
    }).then((yes) => {
      if (yes) {
        deleteUser(item?.id);
      }
    });
  };

  const onViewDetail = (item) => {
    if (!item?.id) {
      return notify("error", t("record-management:messages.error"));
    }
    navigate(`detail/${item?.id}`);
  };

  const onSubmit = () => {
    setPage(0);
    setPageSize(5);
    setSearchKeyword(keyword);
    setSearchBerth(valueBerth);
    setSearchVessel(valueVessel);
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const params = {
        page: page,
        amount: pageSize,
        search: searchKeyword,
        berthId: searchBerth || "",
        vesselId: searchVessel || "",
        order: first(sortModel)?.field,
        mode: first(sortModel)?.sort?.toUpperCase(),
      };

      const resp = await RecordManagementService.getAll(params);

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

  const deleteUser = async (id) => {
    try {
      const resp = await RecordManagementService.deleteById(id);

      if (resp?.data?.success) {
        notify("success", t("record-management:messages.delete_success"));

        if (page > 0 && data?.data?.length === 1) {
          let newPage = page - 1;

          setPage(newPage);
        }

        fetchData();
      }
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };

  const resyncData = async (id) => {
    // try {
    //   const resp = await RecordManagementService.resyncData(id);
    //   if (resp?.data?.success) {
    //     notify("success", t("record-management:messages.resync_success"));
    //     if (page > 0 && data?.data?.length === 1) {
    //       let newPage = page - 1;
    //       setPage(newPage);
    //     }
    //     fetchData();
    //   }
    // } catch (error) {
    //   console.error(error?.response?.data?.message);
    //   notify("error", t("record-management:messages.resync_failed"));
    // }
  };

  const onResync = (item) => {
    // try {
    //   swal({
    //     title: t("record-management:dialog.resync_title"),
    //     text: t("record-management:dialog.resync_description", {
    //       sessionId: item?.sessionId,
    //     }),
    //     icon: "info",
    //     buttons: [t("common:button.no"), t("common:button.yes")],
    //   }).then((yes) => {
    //     if (yes) {
    //       resyncData(item?.id);
    //     }
    //   });
    // } catch (error) {
    //   console.error(error?.response?.data?.message);
    // }
  };

  const onReplay = async (item) => {
    try {
      const resp = await RecordManagementService.getDetail(item?.id);

      if (resp?.data?.success) {
        const count = resp?.data?.count;

        if (count === 0) {
          notify("error", t("record-management:messages.no_replay_data"));
        } else {
          navigate(`/replays?sessionId=${item?.id}`);
        }
      }
    } catch (error) {}
  };

  const onReset = () => {
    setKeyword("");
    setSearchKeyword("");
    setValueBerth("");
    setSearchBerth("");
    setValueVessel("");
    setSearchVessel("");
    setPage(0);
    setPageSize(5);
  };

  useEffect(() => {
    const fetchVessels = async () => {
      try {
        const resp = await VesselService.getAll();
        if (resp?.data?.success) {
          setVessels(resp?.data?.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchVessels();
  }, []);

  return {
    data,
    page,
    pageSize,
    loading,
    keyword,
    searchKeyword,
    valueBerth,
    searchBerth,
    valueVessel,
    searchVessel,
    sortModel,
    vessels,
    auth,
    onReset,
    onPageChange,
    onPageSizeChange,
    onDelete,
    onViewDetail,
    onSubmit,
    fetchData,
    setKeyword,
    setSearchKeyword,
    setValueBerth,
    setValueVessel,
    onSortModelChange,
    onResync,
    onReplay,
  };
};
