// Global variables, contain test info if ran outside of ZOHO
var mvmNumber = "MVM0000";
var name = "Maartje Eyskens";
var firstName = "Maartje";
var lastName = "Eyskens";
var code = "G";
var numVolw = 0;
var numKind = 0;
var contacts = []

// for (let i =0; i<11; i++) {
// 	contacts.push({
// 		name: "Gopher",
// 		gender: "Gopher (he/him)",
// 		birthDate: "2012-03-28",
// 	})
// }

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
			name = `${response.data[0].Voornaam} ${response.data[0].Account_Name}`;
			firstName = response.data[0].Voornaam;
			lastName = response.data[0].Account_Name;
			mvmNumber = response.data[0].Doelgroep_nummer;
			code = response.data[0].Code;
			numKind = response.data[0].Aantal_12; // Aantal < 12
			numVolw = response.data[0].Aantal_121; // Aantal > 12
		});
		ZOHO.CRM.API.getRelatedRecords({Entity:data.Entity,RecordID:data.EntityId,RelatedList:"Contacts",page:1,per_page:200})
		.then(function(response) {
			console.log(response)
			for (let contact of response.data) {
				contacts.push({
					name: contact.Full_Name,
					gender: contact.Geslacht,
					birthDate: contact.Date_of_Birth,
				})
			}
		})
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

function makeFicheZeephuisje() {
	const doc = new jsPDF({
		orientation: 'landscape',
		unit: 'mm',
		format: 'a4',
	});

	doc.addImage(zeephuisjeFiche, 'PNG', 0, 0, 297, 210);

	doc.text(mvmNumber, 257, 10);
	doc.text(lastName, 27, 23);
	doc.text(firstName, 155, 23);
	doc.text(code, 195, 34);

	const defSize = doc.internal.getFontSize()

	let x = 10;
	let y = 57;
	let c = 0
	for (let contact of contacts) {
		c++;
		doc.setFontSize(defSize * 0.7)
		doc.text(contact.name, x, y);
		doc.text(contact.gender, x + 75, y);
		doc.text(contact.birthDate, x + 100, y);
		y += 6.5;
		if (c == 6) {
			y = 57;
			x = 142;
		}
	}
	doc.setFontSize(defSize)

	doc.save(`${mvmNumber}-zeephuisje.pdf`);
}

function maakFicheOnthaal() {
	const doc = new jsPDF({
		orientation: 'landscape',
		unit: 'mm',
		format: 'a4',
	});

	doc.addImage(onthaalFiche1, 'PNG', 0, 0, 297, 210);

	doc.text(mvmNumber, 237, 20);
	doc.text(lastName, 48, 33);
	doc.text(firstName, 143, 33);
	doc.text(code, 158, 44);

	const defSize = doc.internal.getFontSize()

	let x = 23;
	let y = 62;
	let c = 0
	for (let contact of contacts) {
		c++;
		doc.setFontSize(defSize * 0.7)
		doc.text(contact.name, x, y);
		doc.text(contact.gender, x + 68, y);
		doc.text(contact.birthDate, x + 84, y);
		y += 6;
		if (c == 6) {
			y = 62;
			x = 156;
		}
	}
	doc.setFontSize(defSize)

	doc.addPage('a4', 'landscape')
	doc.addImage(onthaalFiche2, 'PNG', 0, 0, 297, 210);

	doc.save(`${mvmNumber}-onthaal.pdf`);
}
