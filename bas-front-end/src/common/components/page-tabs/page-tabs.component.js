import { Paper, Tabs, Tab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const useStyles = makeStyles({
  root: {
    borderBottom: "3px solid rgba(211, 211, 211, 0.29) !important;",
  },
  wrapper: {
    fontWeight: 600,
  },
});

export const PageTabs = ({ valueTab, handleChangeTab, tabList = [] }) => {
  const classes = useStyles();
  return (
    <Paper paper classes={{ root: classes.root }}>
      <Tabs
        value={valueTab}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChangeTab}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
        TabIndicatorProps={{ style: { background: "#3699ff" } }}
      >
        {tabList.length > 0 &&
          tabList.map((tab, index) => {
            return (
              <Tab
                label={tab.label}
                {...a11yProps(index)}
                classes={{ wrapper: classes.wrapper }}
                key={index}
              />
            );
          })}
      </Tabs>
    </Paper>
  );
};
