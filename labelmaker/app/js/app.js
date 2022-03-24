// Global variables, contain test info if ran outside of ZOHO
var mvmNumber = "MVM0000";
var naam = "Maartje Eyskens";
var firstName = "Maartje";
var lastName = "Eyskens";
var code = "G";
var dag = "Donderdag";
var numVolw = 0;
var numKind = 0;
var contacts = [];
var typeVoeding = "test";
var einddatum = "";

function initializeWidget() {
  /*
   * Subscribe to the EmbeddedApp onPageLoad event before initializing the widget
   */
  ZOHO.embeddedApp.on("PageLoad", function (data) {
    $("#nodata-alert").alert("close");
    if (!data || !data.Entity) {
      $("#nodata-alert").alert();
      return;
    }
    ZOHO.CRM.API.getRecord({
      Entity: data.Entity,
      RecordID: data.EntityId,
    }).then(function (response) {
      naam = `${response.data[0].Voornaam} ${response.data[0].Account_Name}`;
      firstName = response.data[0].Voornaam;
      lastName = response.data[0].Account_Name;
      mvmNumber = response.data[0].Doelgroep_nummer;
      code = response.data[0].Code;
      dag = response.data[0].Dag;
      typeVoeding = response.data[0].Geloof; // this zoho field name change keeps byting me
      numKind = response.data[0].Aantal_12; // Aantal < 12
      numVolw = response.data[0].Aantal_121; // Aantal > 12
      const date = new Date(response.data[0].Nieuwe_evaluatie);
      einddatum = `${
        date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
      }/${
        date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
      }/${date.getFullYear()}`;
    });
    ZOHO.CRM.API.getRelatedRecords({
      Entity: data.Entity,
      RecordID: data.EntityId,
      RelatedList: "Contacts",
      page: 1,
      per_page: 200,
    }).then(function (response) {
      console.log(response);
      for (let contact of response.data) {
        contacts.push({
          name: contact.Full_Name,
          gender: contact.Geslacht,
          birthDate: contact.Date_of_Birth,
        });
      }
    });
  });
  /*
   * initialize the widget.
   */
  ZOHO.embeddedApp.init();
}

function makeKaartje() {
  sendPrint("print", {
    mvmNummer: mvmNumber,
    naam: naam,
    volwassenen: numVolw,
    kinderen: numKind,
    voeding: typeVoeding,
    dag: dag,
  }).then(
    (resp) => {
      alert("Print verzonden!");
      $("#bericht").val("");
    },
    () => alert("Fout opgetreden, print niet verzonden")
  );
}

function makeLidkaart() {
  sendPrint("lid", {
    mvmNummer,
    naam,
    einddatum,
  }).then(
    (resp) => {
      alert("Print verzonden!");
      $("#bericht").val("");
    },
    () => alert("Fout opgetreden, print niet verzonden")
  );
}

async function sendPrint(path, data) {
  const response = await fetch(`https://label.print.mvm.digital/${path}`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  return await response.json();
}
