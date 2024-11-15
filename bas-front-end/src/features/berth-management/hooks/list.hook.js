import { useQuery } from "common/hooks";
import { BerthService } from "common/services";
import { decodePageData, notify } from "common/utils";
import { first } from "lodash";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

export const useBerthList = () => {
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

  const { auth } = useSelector((state) => state?.user);
  const [sortModel, setSortModel] = useState([
    {
      field: "createdAt",
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
      title: t("berth:dialog.delete_title"),
      text: t("berth:dialog.delete_description", {
        fullName: item?.fullName,
      }),
      icon: "warning",
      buttons: [t("common:button.no"), t("common:button.yes")],
    }).then((yes) => {
      if (yes) {
        deleteData(item?.id);
      }
    });
  };

  const onEdit = (item) => {
    if (!item?.id) {
      return notify("error", t("berth:messages.error"));
    }
    navigate(`edit/${item?.id}`);
  };

  const onSubmit = () => {
    setPage(0);
    setPageSize(5);
    setSearchKeyword(keyword);
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const params = {
        page: page,
        amount: pageSize,
        search: searchKeyword,
        order: first(sortModel)?.field,
        mode: first(sortModel)?.sort?.toUpperCase(),
      };

      const resp = await BerthService.getAll(params);

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
      const resp = await BerthService.deleteById(id);

      if (resp?.data?.success) {
        notify("success", t("berth:messages.delete_success"));

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
    onSubmit,
    fetchData,
    setKeyword,
    setSearchKeyword,
    onSortModelChange,
  };
};
