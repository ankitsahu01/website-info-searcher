import React, { useState } from "react";
import "../css/WebsiteInfoSearcher.css";

const WebsiteInfoSearcher = () => {
  const [domainName, setDomainName] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleInput = (e) => {
    setDomainName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let submitBtn = document.getElementsByName("submitBtn")[0];
    let submitBtnText = document.getElementById("submitBtnText");

    submitBtn.disabled = true;
    submitBtn.style.cursor = "not-allowed";
    submitBtn.style.opacity = ".9";
    submitBtnText.innerHTML = "Loading...";
    const url = `/get-website-data?domainName=${domainName}`;
    const res = await fetch(url);
    if (res.status !== 200) {
      alert("Something went wrong!");
      document.getElementsByName('domainName')[0].focus();
    } else {
      setDomainName("");
      const data = await res.json();
      setSearchResult(data);
    }
    submitBtn.disabled = false;
    submitBtn.style.cursor = "pointer";
    submitBtn.style.opacity = "1";
    submitBtnText.innerHTML = "Fetch Info";
  };
  return (
    <>
      <div className="container hv-center">
        <h1 className="text-center">Website Information Searcher</h1>
        <form className="hv-center search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="domainName"
            value={domainName}
            onChange={handleInput}
            placeholder="Enter Website Name"
          />
          <button name="submitBtn" type="submit">
            <span id="submitBtnText">Fetch Info</span>
          </button>
        </form>
      </div>

      <div className="hv-center container">
        {searchResult ? (
          <>
            <table className="result-table">
              <thead>
                <tr>
                  <th colSpan="2">
                    <span>{searchResult.WhoisRecord.domainName}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Organization</th>
                  <td>{searchResult.WhoisRecord.registrant.organization}</td>
                </tr>
                <tr>
                  <th>Expires</th>
                  <td>{new Date(searchResult.WhoisRecord.registryData.expiresDateNormalized).toDateString() + ', ' + new Date(searchResult.WhoisRecord.registryData.expiresDateNormalized).toLocaleTimeString()}</td>
                </tr>
                <tr>
                  <th>IP address</th>
                  <td>{searchResult.WhoisRecord.ips.join('  ,  ')}</td>
                </tr>
                <tr>
                  <th>Geo Location</th>
                  <td>{`${searchResult.location.city}, ${searchResult.location.region} - ${searchResult.location.country}.`}</td>
                </tr>
                {
                    searchResult.DNSData.dnsRecords.filter((record)=>{
                        return record.dnsType==="A" || record.dnsType==="NS" || record.dnsType==="AAAA" || record.dnsType==="CNAME"
                    }).map((record)=>{
                        let value= record.dnsType==="NS" ? record.target : record.address;
                        return(
                            <>
                                <tr key={value}>
                                    <th>{record.dnsType}</th>
                                    <td>{value}</td>
                                </tr>
                            </>
                        )
                    })
                }
              </tbody>
            </table>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default WebsiteInfoSearcher;
