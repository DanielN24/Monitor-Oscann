require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
require("dotenv").config({ path: "./config.env" });

const dbo = require("./db/conn"); //conecon
const model_distribuidor = require('./db/models/model_distribuidor');//distributor db model
const model_oscann = require('./db/models/model_oscann');//oscann db model
const Model_Oscann = require("./model_oscann.json");//fake hardware device array of objects
const graphql_Distributor = require("./graphql_distributor.json");//fake (processed) distributor array of objects
const graphql_response = require("./graphql_response.json"); //fake (original) distributor array of objects 
const cron = require("node-cron");
// cron request
const { http, signs } = require("./util");
const port = process.env.PORT;


//initialize and configure the express API 
const app = express();
app.use(cors())
app.use(express.json());

const routes = require('./routes/routes');

app.use('/api', routes)

app.listen(port, () => {
	dbo.connectToServer(function (err) {
		if (err) console.error(err);

	});
	console.log(`Server is running on port: ${port}`);
});

const saveGraphql = async (distributor_save) => {
	let s = new model_distribuidor(distributor_save);
	await s.save()
	return
};

const updateGraphql = async (distribuidor_update) => {
	await model_distribuidor.findOneAndUpdate(
		distribuidor_update,
		{ new: true }
	);
};

class Main {
	static async get_summary_endpoint() {
		//summary_endpoint = await http.get("/" + "").data; //enHere should go the real endpoint		
	
var dict = graphql_response;
	 //Here Should go the response of the real request	
	 //arArrays used to get the maximum from the request	
	    let max_D = []
		let max_DH = []
		let max_H = []
		let max_Oscann = []
		let max_OSCAN = []
		let max_HOSP = []
		let MAX_DH = []
		//maVariables to store the partial maximums	
		let max_oscann_D = 0
		let max_oscann_H = 0
		let max_oscann_DH = 0
		let max_oscann = 0

		//trloop to extract the maximums	
		for (let idx_res = 0; idx_res < dict.length; idx_res++) {
			for (let idx__dh = 0; idx__dh < dict[idx_res].Distribuidores_hospitalarios.length; idx__dh++) {
				for (let id_H = 0; id_H < dict[idx_res].Distribuidores_hospitalarios[idx__dh].Hospitales.length; id_H++) {
					for (let id_Oscann = 0; id_Oscann < dict[idx_res].Distribuidores_hospitalarios[idx__dh].Hospitales[id_H].Oscann.length; id_Oscann++) {
						let arr = Object.values(dict[idx_res].Distribuidores_hospitalarios[idx__dh].Hospitales[id_H].Oscann[id_Oscann]);
						var arrayOfNumbers = arr.map(Number);
						var arraynumbers = arrayOfNumbers.slice(2, 7);
						max_oscann_D = Math.max(...arraynumbers);
						dict[idx_res].Distribuidores_hospitalarios[idx__dh].Hospitales[id_H].Oscann[id_Oscann].Maximo_oscann = max_oscann_D

						max_Oscann.push(max_oscann_D)
						max_OSCAN.push(max_oscann_D)
					}
					max_oscann_H = Math.max(...max_OSCAN);
					dict[idx_res].Distribuidores_hospitalarios[idx__dh].Hospitales[id_H].Maximo_Hospital = max_oscann_H

					max_H.push(max_oscann_H)
					max_OSCAN = []
					max_HOSP.push(max_oscann_H)
				}
				max_oscann_DH = Math.max(...max_HOSP);
				dict[idx_res].Distribuidores_hospitalarios[idx__dh].Maximo_Dist_Hosp = max_oscann_DH

				max_DH.push(max_oscann_DH)
				max_HOSP = []
				MAX_DH.push(max_oscann_DH)
			}

			max_Oscann = []
			max_H = []
			max_oscann_D = Math.max(...max_DH)
			dict[idx_res].Maximo_Distributor = max_oscann_D
			max_D.push(max_oscann_D)
			max_DH = []
			max_D = []
		}



		//Write on the new file the processed data	
		let dictstring = JSON.stringify(dict);
		let fs = require('fs');
		fs.writeFileSync("graphql_distributor.json", dictstring);
		
		//Here the data from backup is taken to be processed	
		model_distribuidor.find({}, async function (err, data) {
			if (data == 0) {
				console.log("endpoint")
				for (let idx_gql = 0; idx_gql < graphql_Distributor.length; idx_gql++) {
					await saveGraphql(graphql_Distributor[idx_gql]);
				}
				console.log("New insert to empty DB!")
				return
			}

			for (let idx_GQ = 0; idx_GQ < graphql_Distributor.length; idx_GQ++) {
				for (let idx_M_o = 0; idx_M_o < data.length; idx_M_o++) {
					if (data[idx_M_o].nombre_distribuidor === graphql_Distributor[idx_GQ].nombre_distribuidor) {
							setTimeout(function () {
								console.log("Database Updated!")
								updateGraphql(graphql_Distributor[idx_GQ]);
							}, 3000);
					}
				}
			}
		}).sort({ updatedAt: -1 }).select('-_id -createdAt -updatedAt -__v');
	}
}


//Here the cron function is defined
cron.schedule("* * * * *", () => {
	Main.get_summary_endpoint();
});
