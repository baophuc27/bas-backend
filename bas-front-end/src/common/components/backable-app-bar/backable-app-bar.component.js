import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { MobileLanguageSwitcher } from "common/components";
import classes from "./backable-app-bar.style.module.css";

const useStyles = makeStyles((theme) => ({
  button: {
    width: 42,
    height: 42,
    padding: 6,
    margin: 0,
  },
}));

export const BackableAppBar = ({ onBack = () => {}, title }) => {
  const muiClasses = useStyles();

  return (
    <div className={classes.container}>
      <IconButton
        className={muiClasses.button}
        style={{ marginRight: 6 }}
        onClick={onBack}
        disableRipple
      >
        <ArrowBackIcon />
      </IconButton>

      <span className={classes.title}>{title}</span>

      <MobileLanguageSwitcher />
    </div>
  );
};
