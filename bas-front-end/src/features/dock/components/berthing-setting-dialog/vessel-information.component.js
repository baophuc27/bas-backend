import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import VesselRouteImg from "assets/images/vessel-route.png";
import { SharedInputField, SharedSelectField } from "common/components";
import { VesselService } from "common/services";
import i18next, { t } from "i18next";
import { memo, useEffect, useMemo, useState } from "react";
import { COUNTRIES_DATA } from "setup/data/country";
import styles from "./berthing-setting-dialog.style.module.css";

const useStyles = makeStyles({
  vesselRadioGroup: {
    flexDirection: "row",
  },
});

const VesselInformation = ({
  values,
  handleChange,
  errors,
  touched,
  setValues,
  setFieldTouched,
  isRecord,
}) => {
  const classes = useStyles();
  const [infoOption, setInfoOption] = useState("system"); // system || AIS
  const [vesselData, setVesselData] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const validateInputNumber = (value, name) => {
    if (value.match(/^\d+(\.\d{1,2})?$/) || value === "") {
      handleChange({
        target: {
          name: name,
          value: value,
        },
      });
    }
  };

  const validateCoordinates = (value, name) => {
    if (value.match(/^\d+(\.\d{1,6})?$/) || value === "") {
      handleChange({
        target: {
          name: name,
          value: value,
        },
      });
    }
  };

  const handleBlur = (newId) => {
    setVesselData((prev) => [...prev, { code: newId }]);
    setValues({
      ...values,
      vesselIMO: newId,
    });
  };

  useEffect(() => {
    const fetchVesselData = async () => {
      const response = await VesselService.getAll();
      if (response?.data?.success) {
        setVesselData(response?.data?.data);
      }
    };
    fetchVesselData();
  }, []);

  // sample data
  // id: 5,
  // code: "SHIP_005",
  // name: "Vessel 5",
  // nameEn: "Vessel 5",
  // flag: "VietNam",
  // length: 543,
  // beam: 113,
  // type: null,
  // builder: null,
  // built: null,
  // owner: null,
  // manager: null,
  // maxDraught: null,
  // class: null,
  // nt: null,
  // gt: null,
  // teu: null,
  // dwt: null,
  // gas: null,
  // crude: null,
  // longitude: null,
  // latitude: null,
  // speed: null,
  // callSign: null,
  // shape: null,
  // createdAt: "2024-07-09T15:16:39.347Z",
  // updatedAt: "2024-08-12T14:08:09.435Z",
  // deletedAt: null,

  useEffect(() => {
    if (!values.vesselIMO) {
      setValues({
        ...values,
      });
      return;
    }
    const vessel = vesselData.find(
      (item) => item.code?.toString() === values.vesselIMO?.toString()
    );
    if (!vessel) return;
    setValues({
      ...values,
      vesselName: i18next.language.includes("en") ? vessel.nameEn : vessel.name,
      vesselFlag: vessel.flag ?? "",
      vesselLength: vessel.length ?? "",
      vesselBeam: vessel.beam ?? "",
      vesselType: vessel.type?.toString() ?? "",
      vesselBuilder: vessel.builder ?? "",
      vesselBuilt: vessel.built ?? "",
      vesselOwner: vessel.owner ?? "",
      vesselManager: vessel.manager ?? "",
      vesselMaxDraught: vessel.maxDraught ?? "",
      vesselClass: vessel.class ?? "",
      vesselNT: vessel.nt ?? "",
      vesselGT: vessel.gt ?? "",
      vesselTEU: vessel.teu ?? "",
      vesselDWT: vessel.dwt ?? "",
      vesselGas: vessel.gas ?? "",
      vesselCRUDE: vessel.crude ?? "",
      vesselLongitude: vessel.longitude ?? "",
      vesselLatitude: vessel.latitude ?? "",
      vesselHeading: vessel.heading ?? "",
      vesselSpeed: vessel.speed ?? "",
      vesselCallSign: vessel.callSign ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.vesselIMO, vesselData]);

  const vesselOptions = useMemo(() => {
    return (
      vesselData.map((item) => ({
        label: item.code?.toString(),
        value: item.code?.toString(),
      })) ?? []
    );
  }, [vesselData]);

  return (
    <div className={styles.section}>
      <FormControl component="fieldset">
        <RadioGroup
          display="flex"
          value={infoOption}
          // onChange={(e) => setInfoOption(e.target.value)}
          className={classes.vesselRadioGroup}
        >
          <FormControlLabel
            value="system"
            control={<Radio color="primary" />}
            label={t("berthing:vessel_information.bas_system")}
          />
          <FormControlLabel
            value="AIS"
            control={<Radio color="primary" />}
            label="AIS"
            disabled
          />
        </RadioGroup>
      </FormControl>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <SharedSelectField
            required
            label="IMO"
            type="text"
            name="vesselIMO"
            options={vesselOptions}
            defaultValue={values?.vesselIMO?.toString()}
            onChange={(_, value) => {
              handleChange({
                target: { name: "vesselIMO", value: value },
              });
            }}
            errorMsg={
              touched.vesselIMO && errors.vesselIMO ? errors.vesselIMO : ""
            }
            className={styles.selectUpcomingStatus}
            onBlur={(e) => {
              const find = vesselData.find(
                (item) => item.code?.toString() === e.target.value
              );
              if (!find) {
                handleBlur(e.target.value);
              }
            }}
            disableClearable={values.vesselIMO ? false : true}
            disabled={isRecord}
          />
        </Grid>

        <Grid item xs={4}>
          <SharedInputField
            required
            label={t("berthing:vessel_information.vessel_name")}
            type="text"
            name="vesselName"
            value={values.vesselName}
            onChange={handleChange}
            errorMsg={
              touched.vesselName && errors.vesselName ? errors.vesselName : ""
            }
            disabled={isRecord}
          />
        </Grid>

        <Grid item xs={4}>
          <SharedSelectField
            required
            label={t("berthing:vessel_information.vessel_flag")}
            name="vesselFlag"
            options={COUNTRIES_DATA}
            className={styles.selectUpcomingStatus}
            onChange={(_, value) => {
              handleChange({
                target: { name: "vesselFlag", value: value },
              });
            }}
            defaultValue={values.vesselFlag}
            disableClearable={values.vesselFlag ? false : true}
            errorMsg={
              touched.vesselFlag && errors.vesselFlag ? errors.vesselFlag : ""
            }
            disabled={isRecord}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} className={styles.groupInput}>
        <Grid item xs={6}>
          <SharedInputField
            required
            label={t("berthing:vessel_information.length") + " (m)"}
            type="number"
            name="vesselLength"
            value={values.vesselLength}
            onChange={(e) =>
              validateInputNumber(e.target.value, "vesselLength")
            }
            errorMsg={
              touched.vesselLength && errors.vesselLength
                ? errors.vesselLength
                : ""
            }
            onBlur={() => {
              setFieldTouched("vesselLength", true);
            }}
            disabled={isRecord}
          />
        </Grid>

        <Grid item xs={6}>
          <SharedInputField
            disabled={isRecord}
            label={t("berthing:vessel_information.beam") + " (m)"}
            type="number"
            name="vesselBeam"
            value={values.vesselBeam}
            onChange={(e) => validateInputNumber(e.target.value, "vesselBeam")}
            required
            errorMsg={
              touched.vesselBeam && errors.vesselBeam ? errors.vesselBeam : ""
            }
            onBlur={() => {
              setFieldTouched("vesselBeam", true);
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} className={styles.groupInput}>
        <Grid item xs={6}>
          <SharedInputField
            label={t("berthing:vessel_information.type")}
            name="vesselType"
            value={values.vesselType}
            onChange={handleChange}
            errorMsg={
              touched.vesselType && errors.vesselType ? errors.vesselType : ""
            }
            onBlur={() => {
              setFieldTouched("vesselType", true);
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <Box className="form-label">
            {t("berthing:vessel_information.vessel_direction")}
          </Box>
          <Select
            value={values.vesselDirection ?? false}
            defaultValue={values.vesselDirection ?? false}
            onChange={handleChange}
            name="vesselDirection"
            onSelect={(e) => handleChange(e)}
            className={styles.vesselRouteSelect}
            SelectDisplayProps={{
              className: styles.vesselRouteSelectDisplay,
            }}
          >
            <MenuItem value={false} className={styles.vesselRouteImgContainer}>
              <img
                src={VesselRouteImg}
                alt="vessel-route-left"
                className={styles.vesselRouteImg}
              />
            </MenuItem>
            <MenuItem value={true} className={styles.vesselRouteImgContainer}>
              <img
                src={VesselRouteImg}
                alt="vessel-route-right"
                style={{ transform: "rotate(180deg)" }}
                className={styles.vesselRouteImg}
              />
            </MenuItem>
          </Select>
        </Grid>
      </Grid>

      {showMore && (
        <div>
          <Grid container spacing={2} className={styles.groupInput}>
            <Grid item xs={6}>
              <SharedInputField
                label={t("berthing:vessel_information.builder")}
                name="vesselBuilder"
                value={values.vesselBuilder}
                onChange={handleChange}
                errorMsg={
                  touched.vesselBuilder && errors.vesselBuilder
                    ? errors.vesselBuilder
                    : ""
                }
              />
            </Grid>

            <Grid item xs={6}>
              <SharedInputField
                label={t("berthing:vessel_information.built")}
                name="vesselBuilt"
                value={values.vesselBuilt}
                type="number"
                onChange={(e) => {
                  const value = e.target.value;
                  // validate year
                  if (value.match(/^\d{0,4}$/) || value === "") {
                    handleChange({
                      target: {
                        name: "vesselBuilt",
                        value: value,
                      },
                    });
                  }
                }}
                errorMsg={
                  touched.vesselBuilt && errors.vesselBuilt
                    ? errors.vesselBuilt
                    : ""
                }
                onBlur={() => {
                  setFieldTouched("vesselBuilt", true);
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} className={styles.groupInput}>
            <Grid item xs={6}>
              <SharedInputField
                label={t("berthing:vessel_information.owner")}
                name="vesselOwner"
                value={values.vesselOwner}
                onChange={handleChange}
                errorMsg={
                  touched.vesselOwner && errors.vesselOwner
                    ? errors.vesselOwner
                    : ""
                }
                onBlur={() => {
                  setFieldTouched("vesselOwner", true);
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <SharedInputField
                label={t("berthing:vessel_information.manager")}
                name="vesselManager"
                value={values.vesselManager}
                onChange={handleChange}
                errorMsg={
                  touched.vesselManager && errors.vesselManager
                    ? errors.vesselManager
                    : ""
                }
                onBlur={() => {
                  setFieldTouched("vesselManager", true);
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} className={styles.groupInput}>
            <Grid item xs={6}>
              <SharedInputField
                label={t("berthing:vessel_information.maxdraught") + " (m)"}
                name="vesselMaxDraught"
                value={values.vesselMaxDraught}
                type="number"
                onChange={(e) =>
                  validateInputNumber(e.target.value, "vesselMaxDraught")
                }
                errorMsg={
                  touched.vesselMaxDraught && errors.vesselMaxDraught
                    ? errors.vesselMaxDraught
                    : ""
                }
              />
            </Grid>

            <Grid item xs={6}>
              <SharedInputField
                label={t("berthing:vessel_information.class")}
                name="vesselClass"
                value={values.vesselClass}
                onChange={handleChange}
                errorMsg={
                  touched.vesselClass && errors.vesselClass
                    ? errors.vesselClass
                    : ""
                }
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} className={styles.groupInput}>
            <Grid item xs={6}>
              <SharedInputField
                label="NT"
                name="vesselNT"
                value={values.vesselNT}
                type="number"
                onChange={(e) =>
                  validateInputNumber(e.target.value, "vesselNT")
                }
                errorMsg={
                  touched.vesselNT && errors.vesselNT ? errors.vesselNT : ""
                }
              />
            </Grid>

            <Grid item xs={6}>
              <SharedInputField
                label="GT"
                name="vesselGT"
                value={values.vesselGT}
                type="number"
                onChange={(e) =>
                  validateInputNumber(e.target.value, "vesselGT")
                }
                errorMsg={
                  touched.vesselGT && errors.vesselGT ? errors.vesselGT : ""
                }
                onBlur={() => {
                  setFieldTouched("vesselGT", true);
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} className={styles.groupInput}>
            <Grid item xs={6}>
              <SharedInputField
                label="TEU"
                name="vesselTEU"
                value={values.vesselTEU}
                type="number"
                onChange={(e) =>
                  validateInputNumber(e.target.value, "vesselTEU")
                }
                errorMsg={
                  touched.vesselTEU && errors.vesselTEU ? errors.vesselTEU : ""
                }
              />
            </Grid>

            <Grid item xs={6}>
              <SharedInputField
                label="DWT"
                name="vesselDWT"
                value={values.vesselDWT}
                type="number"
                onChange={(e) =>
                  validateInputNumber(e.target.value, "vesselDWT")
                }
                errorMsg={
                  touched.vesselDWT && errors.vesselDWT ? errors.vesselDWT : ""
                }
                onBlur={() => {
                  setFieldTouched("vesselDWT", true);
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} className={styles.groupInput}>
            <Grid item xs={6}>
              <SharedInputField
                label={t("berthing:vessel_information.gas")}
                name="vesselGas"
                value={values.vesselGas}
                type="number"
                onChange={(e) =>
                  validateInputNumber(e.target.value, "vesselGas")
                }
                errorMsg={
                  touched.vesselGas && errors.vesselGas ? errors.vesselGas : ""
                }
              />
            </Grid>

            <Grid item xs={6}>
              <SharedInputField
                label="CRUDE"
                name="vesselCRUDE"
                value={values.vesselCRUDE}
                type="number"
                onChange={(e) =>
                  validateInputNumber(e.target.value, "vesselCRUDE")
                }
                errorMsg={
                  touched.vesselCRUDE && errors.vesselCRUDE
                    ? errors.vesselCRUDE
                    : ""
                }
                onBlur={() => {
                  setFieldTouched("vesselCRUDE", true);
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} className={styles.groupInput}>
            <Grid item xs={6}>
              <SharedInputField
                label={t("berthing:vessel_information.longitude")}
                name="vesselLongitude"
                value={values.vesselLongitude}
                type="number"
                onChange={(e) =>
                  validateCoordinates(e.target.value, "vesselLongitude")
                }
                errorMsg={
                  touched.vesselLongitude && errors.vesselLongitude
                    ? errors.vesselLongitude
                    : ""
                }
              />
            </Grid>

            <Grid item xs={6}>
              <SharedInputField
                label={t("berthing:vessel_information.latitude")}
                name="vesselLatitude"
                value={values.vesselLatitude}
                type="number"
                onChange={(e) =>
                  validateCoordinates(e.target.value, "vesselLatitude")
                }
                errorMsg={
                  touched.vesselLatitude && errors.vesselLatitude
                    ? errors.vesselLatitude
                    : ""
                }
                onBlur={() => {
                  setFieldTouched("vesselLatitude", true);
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} className={styles.groupInput}>
            <Grid item xs={6}>
              <SharedInputField
                label={t("berthing:vessel_information.heading")}
                name="vesselHeading"
                value={values.vesselHeading}
                type="number"
                onChange={(e) =>
                  validateInputNumber(e.target.value, "vesselHeading")
                }
                errorMsg={
                  touched.vesselHeading && errors.vesselHeading
                    ? errors.vesselHeading
                    : ""
                }
              />
            </Grid>

            <Grid item xs={6}>
              <SharedInputField
                label={t("berthing:vessel_information.speed")}
                name="vesselSpeed"
                value={values.vesselSpeed}
                type="number"
                onChange={(e) =>
                  validateInputNumber(e.target.value, "vesselSpeed")
                }
                errorMsg={
                  touched.vesselSpeed && errors.vesselSpeed
                    ? errors.vesselSpeed
                    : ""
                }
                onBlur={() => {
                  setFieldTouched("vesselSpeed", true);
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} className={styles.groupInput}>
            <Grid item xs={6}>
              <SharedInputField
                label={t("berthing:vessel_information.callsign")}
                name="vesselCallSign"
                value={values.vesselCallSign}
                onChange={handleChange}
                errorMsg={
                  touched.vesselCallSign && errors.vesselCallSign
                    ? errors.vesselCallSign
                    : ""
                }
              />
            </Grid>
          </Grid>
        </div>
      )}

      <div className={styles.showMoreLine}>
        <div className={styles.showMore} onClick={() => setShowMore(!showMore)}>
          {showMore
            ? t("berthing:vessel_information.collapse")
            : t("berthing:vessel_information.show_more")}
        </div>
      </div>
    </div>
  );
};

export default memo(VesselInformation);
