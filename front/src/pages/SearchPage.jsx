import { Col, Row, Typography } from "antd";
import { useEffect, useState } from "react";

import Card from "../components/Card.jsx";
import Map from "../components/Map.jsx";
import Filter from "../components/Filter";
import "../styles/style.css";

import apiController from "../services/apiSearchHelper";
import HeaderComponent from "../components/Header.jsx";

const { Title } = Typography;

const SearchPage = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterPostalCode, setFilterPostalCode] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterActivity, setFilterActivity] = useState("");
  const [afficherMenu, setAfficherMenu] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [marginBlock, setMarginBlock] = useState(0);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    (async () => {
      if (
        filterName === "" &&
        filterPostalCode === "" &&
        filterDepartment === "" &&
        filterActivity === ""
      ) {
        const res = await apiController.searchCompanies(
          "aes",
          "",
          "",
          "",
          "",
          ""
        );
        if (!res.companies || res.companies.length === 0) {
          return;
        }
        return setCompanies(res.companies);
      }

      const res = await apiController.searchCompanies(
        filterName,
        filterPostalCode,
        filterDepartment,
        filterActivity,
        "",
        ""
      );
      if (!res.companies || res.companies.length === 0) {
        return;
      }
      setCompanies(res.companies);
    })();
  }, [filterActivity, filterPostalCode, filterDepartment, filterName]);

  const selectCompany = (company) => {
    setSelectedCompany(company);
  };

  const setfilters = (nom, codePostal, Departement, Activity) => {
    setFilterActivity(Activity);
    setFilterPostalCode(codePostal);
    setFilterDepartment(Departement);
    setFilterName(nom);
  };

  useEffect(() => {
    if (width <= 450) {
      if (afficherMenu) {
        setMarginBlock("480px")
        console.log(width)
      }
      else {
        setMarginBlock("130px")
      }
    }
    else {
      setMarginBlock(0)
    }
  }, [afficherMenu, width])

  return (
    <>
      <HeaderComponent />
      <Filter
        setfilters={setfilters}
        setAfficherMenu={setAfficherMenu}
        afficherMenu={afficherMenu}
      />
      <div
        style={{
          marginTop: marginBlock 
        }}
      >
        <Row
        >
          <Col xs={24} sm={24} md={24} lg={14} xl={14}
            className="search-page"
          >
            {companies.length === 0 ? (
              <Title level={3}> Aucun résultat </Title>
            ) : (
              <Row>
                {companies.map((company) => {
                  return (
                    <Col
                      key={company.companyIdentifier}
                      span={24}
                      onClick={() => selectCompany(company)}
                    >
                      <Card company={company} />
                    </Col>
                  );
                })}
              </Row>
            )}
          </Col>
          <Col xs={24} sm={24} md={24} lg={10} xl={10} style={{ height: "98vh", width: "100%" }}>
            {selectedCompany.establishments &&
              selectedCompany.establishments.length > 0 ? (
              <Map
                style={{
                  zIndex: 0,
                }}
                points={selectedCompany.establishments.map((establishment) => {
                  if (!establishment.latitude || !establishment.longitude) {
                    return [0, 0];
                  }
                  return [
                    parseFloat(establishment.latitude),
                    parseFloat(establishment.longitude),
                  ];
                })}
              />
            ) : (
              <Map points={[]} />
            )}
          </Col>
        </Row>
      </div>

    </>
  );
};

export default SearchPage;
