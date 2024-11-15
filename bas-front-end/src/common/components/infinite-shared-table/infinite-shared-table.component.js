import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useTranslation } from "react-i18next";
import { OverflowTip } from "../overflow-tip";
import {
  DEFAULT_COLUMNS,
  DEFAULT_DATA,
  DEFAULT_ROWS,
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
    // marginBottom: theme.spacing(2),
  },
  tableContainer: {},
  table: {
    // minWidth: 750,
    // maxHeight: "500px",
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
  tableRowDisabled: {
    backgroundColor: "#D9D9D9",
  },
}));

export const InfiniteSharedTable = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("fullname");
  const {
    content: {
      columns = DEFAULT_COLUMNS,
      rows = DEFAULT_ROWS,
      actions,
      childrens = [],
    },
    data = DEFAULT_DATA,
    actionHandlers,
    onSortModelChange,
    onEndReached,
    dataItem,
    isDisabled = false,
    cellStyles = {},
    tableStyles = {},
  } = props;
  const [isLoading, setIsLoading] = React.useState(false);
  const listInnerRef = React.useRef();

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
          return rawValue;
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
    actionHandlers[key](item);
  };

  const renderActions = (row, key, index) => {
    let disabled = false;
    let hide = false;
    const disabledControls = props["disabledControls"];
    const hideControls = props["hideControls"];

    if (hideControls && key in hideControls) {
      hide = hideControls[key](row);
    }

    if (disabledControls && key in disabledControls) {
      disabled = disabledControls[key](row);
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
              {actions[key]}
            </span>
          );
        } else {
          return (
            <span
              className="icon-wrapper"
              onClick={() => emitActionEvent(key, row)}
              key={`actions-${key}-${index}`}
            >
              {actions[key]}
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
            {actions[key]}
          </span>
        );
      } else {
        return (
          <span
            className="icon-wrapper"
            onClick={() => emitActionEvent(key, row)}
            key={`actions-${key}-${index}`}
          >
            {actions[key]}
          </span>
        );
      }
    }
  };

  const renderCell = (columns) => {
    return columns.map((column) => {
      const align = column["align"] || "left";
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

        default:
          break;
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
                    paddingRight: justifyContent === "center" ? 24 : 0,
                  }}
                >
                  <OverflowTip value={row}>{row}</OverflowTip>
                </div>
              );
            },
      };
    });
  };

  const renderColumns = (hasChild) => {
    let newColumns = renderCell(columns);

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

    if (hasChild) {
      newColumns.slice(0).forEach((column) => {
        childrens.forEach((children) => {
          if (children.field === column.field) {
            newColumns.splice(
              newColumns.indexOf(column),
              1,
              ...renderCell(children.childs),
            );
          }
        });
      });
    }

    return newColumns;
  };

  const renderRows = () => {
    return data.map((dataItem) => {
      return getObjectValue(dataItem);
    });
  };

  React.useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
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

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 1) {
        onEndReached();
      }
    }
  };

  return (
    <div className="shared-data-grid">
      {isLoading && (
        <div className="shared-data-grid-spinner">
          <CircularProgress />
        </div>
      )}

      {!isLoading && data.length === 0 && (
        <p className="shared-data-grid-empty">{t("common:table.no-data")}</p>
      )}

      {!isLoading && data.length > 0 && (
        <div
          ref={listInnerRef}
          onScroll={onScroll}
          style={{
            maxHeight: 500,
            overflowY: "scroll",
            marginBottom: 16,
            ...tableStyles,
          }}
          id="test-table"
        >
          <Paper className={classes.root}>
            <TableContainer
              className={classes.tableContainer}
              style={props?.containerStyles}
            >
              <Table className={classes.table} size={"medium"}>
                <TableHead>
                  <TableRow>
                    {renderColumns().map((headCell) => {
                      if (headCell.sortable) {
                        return (
                          <TableCell
                            key={headCell.field}
                            className={headCell.className}
                            style={{ minWidth: headCell.width, ...cellStyles }}
                            align={headCell.align}
                            padding={headCell.padding || "normal"}
                            sortDirection={
                              orderBy === headCell.field && headCell.sortable
                                ? order
                                : false
                            }
                            rowSpan={headCell?.rowSpan || 1}
                            colSpan={headCell?.colSpan || 1}
                          >
                            {headCell.sortable && (
                              <TableSortLabel
                                active={
                                  orderBy === headCell.field &&
                                  headCell.sortable
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
                            style={{
                              minWidth: headCell.width,
                              ...cellStyles,
                            }}
                            align={headCell.align}
                            padding={headCell.padding || "normal"}
                            rowSpan={headCell?.rowSpan || 1}
                            colSpan={headCell?.colSpan || 1}
                          >
                            {headCell.headerName}
                          </TableCell>
                        );
                      }
                    })}
                  </TableRow>
                  {childrens.length > 0 && (
                    <TableRow>
                      {childrens.map((item) => {
                        return item.childs.map((child) => {
                          return (
                            <TableCell
                              key={child.field}
                              className={child.className}
                              style={{ minWidth: child.width, ...cellStyles }}
                              align={child.align}
                              padding={child.padding || "normal"}
                              rowSpan={child?.rowSpan || 1}
                              colSpan={child?.colSpan || 1}
                            >
                              {child.headerName}
                            </TableCell>
                          );
                        });
                      })}
                    </TableRow>
                  )}
                </TableHead>

                <TableBody>
                  {renderRows().map((row, index) => {
                    return (
                      <TableRow
                        tabIndex={-1}
                        key={row.id}
                        className={
                          (row.isSeen === 0 ? classes.tableRowHighLight : " ") +
                          " " +
                          (isDisabled &&
                          dataItem &&
                          dataItem.length >= 10 &&
                          !dataItem.includes(row.syncId)
                            ? classes.tableRowDisabled
                            : "")
                        }
                      >
                        {renderColumns(childrens.length > 0).map((headCell) => {
                          if (!headCell.isActions) {
                            return (
                              <TableCell
                                key={headCell.field}
                                className={headCell.className}
                                style={{
                                  minWidth: headCell.width,
                                  ...cellStyles,
                                  ...(headCell?.condition
                                    ? headCell?.condition(
                                        row[headCell.field],
                                        row,
                                      )
                                    : {}),
                                }}
                                align={headCell.align}
                                padding={headCell.padding || "normal"}
                              >
                                {!headCell.isCheckbox ? (
                                  headCell.renderCell(row[headCell.field])
                                ) : (
                                  <Checkbox
                                    disabled={
                                      dataItem &&
                                      dataItem.length >= 10 &&
                                      !dataItem.includes(row.syncId)
                                    }
                                    onChange={() => {
                                      headCell?.handleCheckboxChange(row);
                                    }}
                                  />
                                )}
                                {/* {row[headCell.field]} */}
                              </TableCell>
                            );
                          } else {
                            return (
                              <TableCell
                                key={headCell.field}
                                className={headCell.className}
                                style={{
                                  minWidth: headCell.width,
                                  ...cellStyles,
                                }}
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
          </Paper>
        </div>
      )}
    </div>
  );
};
