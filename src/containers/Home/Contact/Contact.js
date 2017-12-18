import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./Contact.css";
import FormatModal from "../../../components/UI/FormatModal/FormatModal";
import Input from "../../../components/UI/Input/Input";
import { clone } from "../../../util";
import { withRouter } from "react-router-dom";
import axios from "axios";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import Spinner from "../../../components/UI/Spinner/Spinner";

const countries = {
  AF: "Afghanistan",
  AX: "Aland Islands",
  AL: "Albania",
  DZ: "Algeria",
  AS: "American Samoa",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antarctica",
  AG: "Antigua And Barbuda",
  AR: "Argentina",
  AM: "Armenia",
  AW: "Aruba",
  AU: "Australia",
  AT: "Austria",
  AZ: "Azerbaijan",
  BS: "Bahamas",
  BH: "Bahrain",
  BD: "Bangladesh",
  BB: "Barbados",
  BY: "Belarus",
  BE: "Belgium",
  BZ: "Belize",
  BJ: "Benin",
  BM: "Bermuda",
  BT: "Bhutan",
  BO: "Bolivia",
  BA: "Bosnia And Herzegovina",
  BW: "Botswana",
  BV: "Bouvet Island",
  BR: "Brazil",
  IO: "British Indian Ocean Territory",
  BN: "Brunei Darussalam",
  BG: "Bulgaria",
  BF: "Burkina Faso",
  BI: "Burundi",
  KH: "Cambodia",
  CM: "Cameroon",
  CA: "Canada",
  CV: "Cape Verde",
  KY: "Cayman Islands",
  CF: "Central African Republic",
  TD: "Chad",
  CL: "Chile",
  CN: "China",
  CX: "Christmas Island",
  CC: "Cocos (Keeling) Islands",
  CO: "Colombia",
  KM: "Comoros",
  CG: "Congo",
  CD: "Congo, Democratic Republic",
  CK: "Cook Islands",
  CR: "Costa Rica",
  CI: "Cote D'Ivoire",
  HR: "Croatia",
  CU: "Cuba",
  CY: "Cyprus",
  CZ: "Czech Republic",
  DK: "Denmark",
  DJ: "Djibouti",
  DM: "Dominica",
  DO: "Dominican Republic",
  EC: "Ecuador",
  EG: "Egypt",
  SV: "El Salvador",
  GQ: "Equatorial Guinea",
  ER: "Eritrea",
  EE: "Estonia",
  ET: "Ethiopia",
  FK: "Falkland Islands (Malvinas)",
  FO: "Faroe Islands",
  FJ: "Fiji",
  FI: "Finland",
  FR: "France",
  GF: "French Guiana",
  PF: "French Polynesia",
  TF: "French Southern Territories",
  GA: "Gabon",
  GM: "Gambia",
  GE: "Georgia",
  DE: "Germany",
  GH: "Ghana",
  GI: "Gibraltar",
  GR: "Greece",
  GL: "Greenland",
  GD: "Grenada",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "Guatemala",
  GG: "Guernsey",
  GN: "Guinea",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HT: "Haiti",
  HM: "Heard Island & Mcdonald Islands",
  VA: "Holy See (Vatican City State)",
  HN: "Honduras",
  HK: "Hong Kong",
  HU: "Hungary",
  IS: "Iceland",
  IN: "India",
  ID: "Indonesia",
  IR: "Iran, Islamic Republic Of",
  IQ: "Iraq",
  IE: "Ireland",
  IM: "Isle Of Man",
  IL: "Israel",
  IT: "Italy",
  JM: "Jamaica",
  JP: "Japan",
  JE: "Jersey",
  JO: "Jordan",
  KZ: "Kazakhstan",
  KE: "Kenya",
  KI: "Kiribati",
  KR: "Korea",
  KW: "Kuwait",
  KG: "Kyrgyzstan",
  LA: "Lao People's Democratic Republic",
  LV: "Latvia",
  LB: "Lebanon",
  LS: "Lesotho",
  LR: "Liberia",
  LY: "Libyan Arab Jamahiriya",
  LI: "Liechtenstein",
  LT: "Lithuania",
  LU: "Luxembourg",
  MO: "Macao",
  MK: "Macedonia",
  MG: "Madagascar",
  MW: "Malawi",
  MY: "Malaysia",
  MV: "Maldives",
  ML: "Mali",
  MT: "Malta",
  MH: "Marshall Islands",
  MQ: "Martinique",
  MR: "Mauritania",
  MU: "Mauritius",
  YT: "Mayotte",
  MX: "Mexico",
  FM: "Micronesia, Federated States Of",
  MD: "Moldova",
  MC: "Monaco",
  MN: "Mongolia",
  ME: "Montenegro",
  MS: "Montserrat",
  MA: "Morocco",
  MZ: "Mozambique",
  MM: "Myanmar",
  NA: "Namibia",
  NR: "Nauru",
  NP: "Nepal",
  NL: "Netherlands",
  AN: "Netherlands Antilles",
  NC: "New Caledonia",
  NZ: "New Zealand",
  NI: "Nicaragua",
  NE: "Niger",
  NG: "Nigeria",
  NU: "Niue",
  NF: "Norfolk Island",
  MP: "Northern Mariana Islands",
  NO: "Norway",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PS: "Palestinian Territory, Occupied",
  PA: "Panama",
  PG: "Papua New Guinea",
  PY: "Paraguay",
  PE: "Peru",
  PH: "Philippines",
  PN: "Pitcairn",
  PL: "Poland",
  PT: "Portugal",
  PR: "Puerto Rico",
  QA: "Qatar",
  RE: "Reunion",
  RO: "Romania",
  RU: "Russian Federation",
  RW: "Rwanda",
  BL: "Saint Barthelemy",
  SH: "Saint Helena",
  KN: "Saint Kitts And Nevis",
  LC: "Saint Lucia",
  MF: "Saint Martin",
  PM: "Saint Pierre And Miquelon",
  VC: "Saint Vincent And Grenadines",
  WS: "Samoa",
  SM: "San Marino",
  ST: "Sao Tome And Principe",
  SA: "Saudi Arabia",
  SN: "Senegal",
  RS: "Serbia",
  SC: "Seychelles",
  SL: "Sierra Leone",
  SG: "Singapore",
  SK: "Slovakia",
  SI: "Slovenia",
  SB: "Solomon Islands",
  SO: "Somalia",
  ZA: "South Africa",
  GS: "South Georgia And Sandwich Isl.",
  ES: "Spain",
  LK: "Sri Lanka",
  SD: "Sudan",
  SR: "Suriname",
  SJ: "Svalbard And Jan Mayen",
  SZ: "Swaziland",
  SE: "Sweden",
  CH: "Switzerland",
  SY: "Syrian Arab Republic",
  TW: "Taiwan",
  TJ: "Tajikistan",
  TZ: "Tanzania",
  TH: "Thailand",
  TL: "Timor-Leste",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad And Tobago",
  TN: "Tunisia",
  TR: "Turkey",
  TM: "Turkmenistan",
  TC: "Turks And Caicos Islands",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ukraine",
  AE: "United Arab Emirates",
  GB: "United Kingdom",
  US: "United States",
  UM: "United States Outlying Islands",
  UY: "Uruguay",
  UZ: "Uzbekistan",
  VU: "Vanuatu",
  VE: "Venezuela",
  VN: "Viet Nam",
  VG: "Virgin Islands, British",
  VI: "Virgin Islands, U.S.",
  WF: "Wallis And Futuna",
  EH: "Western Sahara",
  YE: "Yemen",
  ZM: "Zambia",
  ZW: "Zimbabwe"
};

class Contact extends Component {
  constructor(props) {
    super(props);

    this.state = {
      controls: {
        name: {
          elementType: "input",
          label: "Full Name*",
          elementConfig: {
            type: "text",
            placeholder: "Full Name"
          },
          value: "",
          validation: {
            required: true
          },
          valid: false,
          touched: false
        },
        email: {
          elementType: "input",
          label: "Email*",
          elementConfig: {
            type: "email",
            placeholder: "Email Address"
          },
          value: "",
          validation: {
            required: true,
            isEmail: true
          },
          valid: false,
          touched: false
        },
        country: {
          elementType: "select",
          label: "Country",
          elementConfig: {
            options: Object.keys(countries).map(key => ({
              value: key,
              displayValue: countries[key]
            }))
          },
          value: "US",
          validation: {},
          valid: true,
          touched: false
        },
        riskAssets: {
          elementType: "select",
          elementConfig: {
            options: [
              {
                value: "$0 - $20,000",
                displayValue: "$0 - $20,000"
              },
              {
                value: "$20,000 - $40,000",
                displayValue: "$20,000 - $40,000"
              },
              {
                value: "$40,000 - $80,000",
                displayValue: "$40,000 - $80,000"
              },
              {
                value: "$80,000 - $120,000",
                displayValue: "$80,000 - $120,000"
              },
              {
                value: "$120,000+ ",
                displayValue: "$120,000 +"
              }
            ]
          },
          value: "",
          validation: {},
          label: "Risk Assets",
          valid: true,
          touched: false
        },
        stockTradingExp: {
          elementType: "select",
          elementConfig: {
            options: [
              {
                value: "0 years",
                displayValue: "0 years"
              },
              {
                value: "1 year",
                displayValue: "1 year"
              },
              {
                value: "1 - 2 years",
                displayValue: "1 - 2 years"
              },
              {
                value: "2 - 5 years",
                displayValue: "2 - 5 years"
              },
              {
                value: "5 years +",
                displayValue: "5 years +"
              }
            ]
          },
          value: "",
          validation: {},
          label: "Stock Trading Txperience",
          valid: true,
          touched: false
        },
        bondTradingExp: {
          elementType: "select",
          elementConfig: {
            options: [
              {
                value: "0 years",
                displayValue: "0 years"
              },
              {
                value: "1 year",
                displayValue: "1 year"
              },
              {
                value: "1 - 2 years",
                displayValue: "1 - 2 years"
              },
              {
                value: "2 - 5 years",
                displayValue: "2 - 5 years"
              },
              {
                value: "5 years +",
                displayValue: "5 years +"
              }
            ]
          },
          value: "",
          validation: {},
          label: "Bond Trading Experience",
          valid: true,
          touched: false
        },
        futuresTradingExp: {
          elementType: "select",
          elementConfig: {
            options: [
              {
                value: "0 years",
                displayValue: "0 years"
              },
              {
                value: "1 year",
                displayValue: "1 year"
              },
              {
                value: "1 - 2 years",
                displayValue: "1 - 2 years"
              },
              {
                value: "2 - 5 years",
                displayValue: "2 - 5 years"
              },
              {
                value: "5 years +",
                displayValue: "5 years +"
              }
            ]
          },
          value: "",
          validation: {},
          label: "Futures Trading Experience",
          valid: true,
          touched: false
        },
        fxTradingExp: {
          elementType: "select",
          elementConfig: {
            options: [
              {
                value: "0 years",
                displayValue: "0 years"
              },
              {
                value: "1 year",
                displayValue: "1 year"
              },
              {
                value: "1 - 2 years",
                displayValue: "1 - 2 years"
              },
              {
                value: "2 - 5 years",
                displayValue: "2 - 5 years"
              },
              {
                value: "5 years +",
                displayValue: "5 years +"
              }
            ]
          },
          value: "",
          validation: {},
          label: "FX Trading Experience",
          valid: true,
          touched: false
        },
        message: {
          elementType: "textarea",
          elementConfig: {
            type: "text",
            placeholder: "Your Feedback"
          },
          value: "",
          validation: {},
          valid: true,
          touched: false
        }
      },
      formIsValid: false,
      loading: false
    };
  }

  inputChangeHandler = (event, identifier) => {
    const updatedValue = event.target.value,
      isValid = this.checkValidity(
        updatedValue,
        this.state.controls[identifier].validation
      );
    this.setState(prevState => {
      const controls = clone(prevState.controls);
      controls[identifier]["value"] = updatedValue;
      controls[identifier]["valid"] = isValid;
      controls[identifier]["touched"] = true;
      let formIsValid = true;
      for (let key in controls) {
        formIsValid = formIsValid && controls[key].valid;
      }
      return { controls: controls, formIsValid: formIsValid };
    });
  };

  checkValidity(value, rules) {
    let isValid = true;

    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
      isValid = value.trim().length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.trim().length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
      const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      isValid = pattern.test(value.trim()) && isValid;
    }

    return isValid;
  }

  onFormSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });

    //Do axios
    setTimeout(() => {
      this.setState({ loading: false });
      this.props.history.goBack();
    }, 2000);
  };

  render() {
    const formArr = [];
    Object.keys(this.state.controls).forEach(key => {
      formArr.push({
        id: key,
        ...this.state.controls[key]
      });
    });
    return (
      <FormatModal title="Try the demo and share your feedback.">
        <div className={classes.Contact}>
          {this.state.loading ? (
            <Spinner />
          ) : (
            <form onSubmit={this.onFormSubmit}>
              {formArr.map(formElem => (
                <Input
                  key={formElem.id}
                  elementType={formElem.elementType}
                  elementConfig={formElem.elementConfig}
                  value={formElem.value}
                  inputChangeHandler={event =>
                    this.inputChangeHandler(event, formElem.id)
                  }
                  label={formElem.label}
                  valid={formElem.valid || !formElem.touched}
                  style={{
                    width: formElem.elementType === "textarea" ? "100%" : "50%"
                  }}
                />
              ))}
              <span>
                <button disabled={!this.state.formIsValid} type="submit">
                  Send Feedback
                </button>
              </span>
            </form>
          )}
        </div>
      </FormatModal>
    );
  }
}

Contact.propTypes = {
  history: PropTypes.object.isRequired
};
export default withErrorHandler(withRouter(Contact), axios);
