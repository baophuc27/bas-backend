import { useQuery } from "common/hooks";
import { DataAppService } from "common/services";
import { decodePageData, notify } from "common/utils";
import { first } from "lodash";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

export const useDataAppList = () => {
  const { t } = useTranslation();
  const query = useQuery();
  const navigate = useNavigate();
  
  // Initialize state from URL parameters or defaults
  const pageFilter = query.get("pageData")
    ? decodePageData(query.get("pageData"))
    : null;
  
  const [data, setData] = useState([]);
  const [page, setPage] = useState(+query.get("ppi") || 0);
  const [pageSize, setPageSize] = useState(+query.get("ps") || 5);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState(pageFilter?.keyword || "");
  const [searchKeyword, setSearchKeyword] = useState(pageFilter?.keyword || "");

  const { auth } = useSelector((state) => state?.user);
  const [sortModel, setSortModel] = useState([
    {
      field: "createdAt",
      sort: "desc",
    },
  ]);

  // Pagination handlers
  const onPageSizeChange = (params) => {
    setPageSize(params?.pageSize);
    setPage(params?.page);
  };

  const onPageChange = (params) => {
    setPage(params?.page);
  };

  // Sorting handler
  const onSortModelChange = (params) => {
    setSortModel([
      {
        field: params?.field,
        sort: params?.sort,
      },
    ]);
  };

  // CRUD operations
  const onDelete = (item) => {
    swal({
      title: t("dataApp:dialog.delete_title"),
      text: t("dataApp:dialog.delete_description", {
        code: item?.code,
      }),
      icon: "warning",
      buttons: [t("common:button.no"), t("common:button.yes")],
    }).then((yes) => {
      if (yes) {
        deleteData(item?.code);
      }
    });
  };

  const onEdit = (item) => {
    if (!item?.code) {
      return notify("error", t("dataApp:messages.error"));
    }
    navigate(`edit/${item?.code}`);
  };

  const onStatusUpdate = async (item, newStatus) => {
    try {
      const response = await DataAppService.updateStatus(item.code, { status: newStatus });
      if (response?.data?.success) {
        notify("success", t("dataApp:messages.status_update_success"));
        fetchData();
      }
    } catch (error) {
      notify("error", error?.response?.data?.message || t("dataApp:messages.status_update_error"));
    }
  };

  const onSubmit = () => {
    setPage(0);
    setPageSize(5);
    setSearchKeyword(keyword);
  };

  // Data fetching
  const fetchData = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        amount: pageSize,
        search: searchKeyword,
        order: first(sortModel)?.field,
        mode: first(sortModel)?.sort?.toUpperCase(),
      };

      const resp = await DataAppService.getAll(params);

      if (resp?.data?.success) {
        setData({
          data: resp?.data?.data,
          total: resp?.data?.count,
        });
      }
    } catch (error) {
      notify("error", error?.response?.data?.message || t("dataApp:messages.fetch_error"));
    } finally {
      setLoading(false);
    }
  };

  const deleteData = async (code) => {
    try {
      // Since there's no delete endpoint in the API, we could either:
      // 1. Update the status to inactive/deleted
      // 2. Or implement a proper delete method if needed
      const resp = await DataAppService.updateStatus(code, { status: 'INACTIVE' });

      if (resp?.data?.success) {
        notify("success", t("dataApp:messages.delete_success"));

        if (page > 0 && data?.data?.length === 1) {
          let newPage = page - 1;
          setPage(newPage);
        }

        fetchData();
      }
    } catch (error) {
      notify("error", error?.response?.data?.message || t("dataApp:messages.delete_error"));
    }
  };

  // Reset filters
  const onReset = () => {
    setKeyword("");
    setSearchKeyword("");
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
    onEdit,
    onStatusUpdate,
    onSubmit,
    fetchData,
    setKeyword,
    setSearchKeyword,
    onSortModelChange,
  };
};