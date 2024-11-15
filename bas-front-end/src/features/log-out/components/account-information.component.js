import { Avatar, Box, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  container: {
    display: "flex",
    marginBottom: "15px",
  },
  avatar: {
    height: "56px",
    width: "56px",
  },
  nameContainer: {
    textAlign: "left",
    marginLeft: "10px",
    marginTop: "auto",
    marginBottom: "auto",
    overflow: "hidden"
  },
  nameText: {
    fontSize: "16px",
    marginBottom: "5px",
    fontWeight: 500,
    color: "#726f6f",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  smallText: {
    fontSize: "13px",
    color: "#726f6f",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
});

export const AccountInformation = ({ t, data }) => {
  const styles = useStyles();
  return (
    <Box className={styles.container}>
      <Avatar
        alt={data?.avatar || ""}
        className={styles.avatar}
        src={data?.avatar}
      />
      <Box className={styles.nameContainer}>
        <p className={styles.nameText}>{data?.fullName}</p>
        <p className={styles.smallText}>{data?.username}</p>
      </Box>
    </Box>
  );
};
