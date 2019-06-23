// Global variables, contain test info if ran outside of ZOHO
var mvmNumber = "MVM0000";
var name = "Maartje Eyskens";
var code = ""
var numVolw = 0;
var numKind = 0;

function initializeWidget()
{
	/*
	 * Subscribe to the EmbeddedApp onPageLoad event before initializing the widget 
	 */
	ZOHO.embeddedApp.on("PageLoad",function(data) {
		$('#nodata-alert').alert('close')
		if(!data || !data.Entity) {
			$('#nodata-alert').alert()
			return
		}
		ZOHO.CRM.API.getRecord({Entity:data.Entity,RecordID:data.EntityId})
		.then(function(response) {
			console.log(response.data[0])

			name = `${response.data[0].Voornaam} ${response.data[0].Account_Name}`;
			mvmNumber = response.data[0].Doelgroep_nummer;
			code = response.data[0].Code;
			numKind = response.data[0].Aantal_12; // Aantal < 12
			numVolw = response.data[0].Aantal_121; // Aantal > 12
		});		
	})
	/*
	 * initialize the widget.
	 */
	ZOHO.embeddedApp.init();
}

function makeKaartjeVoeding() {
	const doc = new jsPDF({
		orientation: 'landscape',
		unit: 'mm',
		format: 'credit-card',
	})
	doc.text(mvmNumber, 10, 10)
	doc.text(name, 10, 20)
	doc.text(`${numVolw}V + ${numKind}K`, 10, 30)
	doc.text(code, 10, 40)
	doc.save(`${mvmNumber}-voeding.pdf`)
}

function makeKaartjeMateriaal() {
	const doc = new jsPDF({
		orientation: 'landscape',
		unit: 'mm',
		format: 'credit-card',
	})
	doc.text(mvmNumber, 10, 10)
	doc.text(name, 10, 20)
	doc.text(code, 10, 30)
	doc.save(`${mvmNumber}-materiaal.pdf`)
}
