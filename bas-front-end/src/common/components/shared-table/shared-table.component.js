import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery } from "common/hooks";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { OverflowTip } from "../overflow-tip";
import {
  DEFAULT_COLUMNS,
  DEFAULT_DATA,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_ROWS,
  DEFAULT_ROWS_PER_PAGE_OPTIONS,
  ENUMERATION,
  NUMBER,
  OBJECT,
  TEXT,
} from "./constants";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  tableContainer: {
    maxHeight: "500px",
  },
  table: {
    minWidth: 750,
    maxHeight: "500px",
  },
  tableRowHighLight: {
    backgroundColor: "#eeeeee",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

export const SharedTable = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("fullname");
  const {
    content: { columns = DEFAULT_COLUMNS, rows = DEFAULT_ROWS, actions },
    data = DEFAULT_DATA,
    page = DEFAULT_PAGE,
    pageSize = DEFAULT_PAGE_SIZE,
    actionHandlers,
    onPageChange,
    onPageSizeChange,
    onSortModelChange,
    count,
    loading = false,
    hideTablePagination,
    applyPersistPagination = true,
  } = props;
  const [isLoading, setIsLoading] = React.useState(false);
  const query = useQuery();

  const handleChangePage = (event, newPage) => {
    let params = {
      pageSize: pageSize,
      page: newPage,
    };

    if (applyPersistPagination && query.get("p")) {
      const url = new URL(window.location);
      url.searchParams.set("p", newPage);
      window.history.pushState(null, "", url.toString());
    }

    onPageChange(params);
  };

  const handleChangeRowsPerPage = (event) => {
    let params = {
      pageSize: event.target.value,
      page: 0,
    };

    if (applyPersistPagination && query.get("ps")) {
      const url = new URL(window.location);
      url.searchParams.set("ps", event.target.value);
      window.history.pushState(null, "", url.toString());
    }

    onPageSizeChange(params);
  };

  const getFieldValue = (key, obj) => {
    const settings = rows.find((row) => row["field"] === key);
    let rawValue = obj[key];

    if (settings && "type" in settings) {
      switch (settings["type"]) {
        case ENUMERATION: {
          if (typeof rawValue === "boolean") {
            rawValue = rawValue === true ? 1 : 0;
          }

          return settings["values"][rawValue] || settings["default"];
        }

        case OBJECT: {
          let value = rawValue && rawValue[settings["propName"]];

          return value || settings["default"];
        }

        case TEXT: {
          let value = rawValue;

          if ("transformFunc" in settings) {
            value = settings["transformFunc"](rawValue);
          }

          return value || settings["default"];
        }

        case NUMBER: {
          return rawValue;
        }

        default: {
          return;
        }
      }
    }

    return rawValue;
  };

  const getObjectValue = (obj) => {
    let newObject = {};

    for (let key of Object.keys(obj)) {
      newObject[key] = getFieldValue(key, obj);
    }

    return newObject;
  };

  const emitActionEvent = (key, item) => {
    actionHandlers[key](item, { page, pageSize });
  };

  const renderActions = (row, key, index) => {
    let disabled = false;
    let hide = false;
    let tooltip = "";

    const disabledControls = props["disabledControls"];
    const hideControls = props["hideControls"];
    const tooltips = props["tooltips"];

    if (hideControls && key in hideControls) {
      hide = hideControls[key](row);
    }

    if (disabledControls && key in disabledControls) {
      disabled = disabledControls[key](row);
    }

    if (tooltips && key in tooltips) {
      tooltip = tooltips[key](row);
    }

    if (hideControls) {
      if (hide) {
        return;
      } else {
        if (disabled) {
          return (
            <span
              className="icon-wrapper icon-wrapper--disabled"
              key={`actions-${key}-${index}`}
            >
              <Tooltip title={tooltip}>
                <span>{actions[key]}</span>
              </Tooltip>
            </span>
          );
        } else {
          return (
            <span
              className="icon-wrapper"
              onClick={() => emitActionEvent(key, row)}
              key={`actions-${key}-${index}`}
            >
              <Tooltip title={tooltip}>
                <span>{actions[key]}</span>
              </Tooltip>
            </span>
          );
        }
      }
    } else {
      if (disabled) {
        return (
          <span
            className="icon-wrapper icon-wrapper--disabled"
            key={`actions-${key}-${index}`}
          >
            <Tooltip title={tooltip}>
              <span>{actions[key]}</span>
            </Tooltip>
          </span>
        );
      } else {
        return (
          <span
            className="icon-wrapper"
            onClick={() => emitActionEvent(key, row)}
            key={`actions-${key}-${index}`}
          >
            <Tooltip title={tooltip}>
              <span>{actions[key]}</span>
            </Tooltip>
          </span>
        );
      }
    }
  };

  const renderColumns = () => {
    let newColumns = columns.map((column) => {
      const align = column["headerAlign"] || "left";
      let justifyContent = "flex-start";

      switch (align) {
        case "left":
          justifyContent = "flex-start";
          break;

        case "center":
          justifyContent = "center";
          break;

        case "right":
          justifyContent = "flex-end";
          break;

        default: {
          break;
        }
      }

      return {
        ...column,
        renderCell: column.renderCell
          ? column.renderCell
          : (row) => {
              return (
                <div
                  className="cell-wrapper"
                  style={{
                    justifyContent,
                    paddingRight: justifyContent === "center" ? 0 : 24,
                  }}
                >
                  <OverflowTip value={row}>{row}</OverflowTip>
                </div>
              );
            },
      };
    });

    if (Object.keys(actions).length > 0) {
      newColumns.push({
        field: "actions",
        headerName: t("common:table.actions"),
        sortable: false,
        headerAlign: "center",
        className: "sticky",
        align: "center",
        isActions: true,
        disableClickEventBubbling: true,
      });
    }

    return newColumns;
  };

  const renderRows = () => {
    return data.map((dataItem) => {
      return getObjectValue(dataItem);
    });
  };

  const replacePaginationLabels = () => {
    setTimeout(() => {
      const pageSizeTextSelector = ".MuiTablePagination-caption";
      const pageTextSelector =
        ".MuiTablePagination-root > div > p:nth-child(4)";
      const pageSizeText = document.querySelector(pageSizeTextSelector);
      const pageText = document.querySelector(pageTextSelector);
      if (pageSizeText && pageText) {
        const pageTextContent = pageText.innerText;
        pageSizeText.innerText = t("common:table.rows-per-page");

        pageText.innerText = pageTextContent.replace(
          "of",
          t("common:table.page-text")
        );
      }
    }, 1700);
  };

  React.useEffect(() => {
    const pageSizeTextSelector = ".MuiTablePagination-caption";
    const pageTextSelector = ".MuiTablePagination-root > div > p:nth-child(4)";
    const pageSizeText = document.querySelector(pageSizeTextSelector);
    const pageText = document.querySelector(pageTextSelector);

    if (pageSizeText && pageText) {
      const pageTextContent = pageText.innerText;
      pageSizeText.innerText = t("common:table.rows-per-page");

      if (pageTextContent.includes("of"))
        pageText.innerText = pageTextContent.replace(
          "of",
          t("common:table.page-text")
        );
      else
        pageText.innerText = pageTextContent.replace(
          "trên",
          t("common:table.page-text")
        );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, t]);

  React.useEffect(() => {
    setIsLoading(true);
    replacePaginationLabels();

    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createSortHandler = (property) => (event) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    let params = {
      field: property,
      sort: isAsc ? "desc" : "asc",
    };

    setOrderBy(property);
    onSortModelChange(params);
  };

  React.useEffect(() => {
    if (applyPersistPagination && (query.get("p") || query.get("ps"))) {
      let timer = setTimeout(() => {
        onPageChange({
          pageSize: +query.get("ps") || pageSize,
          page: +query.get("p") || page,
        });
        onPageSizeChange({
          pageSize: +query.get("ps") || pageSize,
          page: +query.get("p") || page,
        });

        clearTimeout(timer);
      }, 1000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="shared-data-grid">
      {(isLoading || loading) && (
        <div className="shared-data-grid-spinner">
          <CircularProgress />
        </div>
      )}

      {!(isLoading || loading) && data.length === 0 && (
        <p className="shared-data-grid-empty">{t("common:table.no-data")}</p>
      )}

      {!(loading || isLoading) && data.length > 0 && (
        <Paper className={classes.root}>
          <TableContainer className={classes.tableContainer}>
            <Table className={classes.table} size={"medium"}>
              <TableHead>
                <TableRow>
                  {renderColumns().map((headCell) => {
                    if (headCell.sortable) {
                      return (
                        <TableCell
                          key={headCell.field}
                          className={headCell.className}
                          style={{ minWidth: headCell.width }}
                          align={headCell.align}
                          padding={headCell.padding || "normal"}
                          sortDirection={
                            orderBy === headCell.field && headCell.sortable
                              ? order
                              : false
                          }
                        >
                          {headCell.sortable && (
                            <TableSortLabel
                              active={
                                orderBy === headCell.field && headCell.sortable
                              }
                              direction={
                                orderBy === headCell.field ? order : "asc"
                              }
                              onClick={
                                headCell.sortable
                                  ? createSortHandler(headCell.field)
                                  : null
                              }
                            >
                              {headCell.headerName}
                              {headCell.sortable ? (
                                <span className={classes.visuallyHidden}>
                                  {order === "desc"
                                    ? "sorted descending"
                                    : "sorted ascending"}
                                </span>
                              ) : null}
                            </TableSortLabel>
                          )}
                        </TableCell>
                      );
                    } else {
                      return (
                        <TableCell
                          key={headCell.field}
                          className={headCell.className}
                          style={{ minWidth: headCell.width }}
                          align={headCell.align}
                          padding={headCell.padding || "normal"}
                        >
                          {headCell.headerName}
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {renderRows().map((row, index) => {
                  return (
                    <TableRow
                      tabIndex={-1}
                      key={row.id}
                      className={
                        row.isSeen === 0 ? classes.tableRowHighLight : ""
                      }
                    >
                      {renderColumns().map((headCell) => {
                        if (!headCell.isActions) {
                          return (
                            <TableCell
                              key={headCell.field}
                              className={headCell.className}
                              style={{ minWidth: headCell.width }}
                              align={headCell.align}
                              padding={headCell.padding || "normal"}
                            >
                              {headCell.renderCell(row[headCell.field], row)}
                              {/* {row[headCell.field]} */}
                            </TableCell>
                          );
                        } else {
                          return (
                            <TableCell
                              key={headCell.field}
                              className={headCell.className}
                              style={{ minWidth: headCell.width }}
                              padding={headCell.padding || "normal"}
                            >
                              <div className="icons-wrapper">
                                {Object.keys(actions).map((key, index) => {
                                  return renderActions(row, key, index);
                                })}
                              </div>
                            </TableCell>
                          );
                        }
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {!hideTablePagination && (
            <TablePagination
              rowsPerPageOptions={DEFAULT_ROWS_PER_PAGE_OPTIONS}
              component="div"
              paginationmode="server"
              count={count}
              rowsPerPage={pageSize}
              nextIconButtonText={t("common:table.next-page")}
              backIconButtonText={t("common:table.previous-page")}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </Paper>
      )}
    </div>
  );
};
