const mongoose = require('mongoose');

//It's an example of a model oscann

const OscannSchema = new mongoose.Schema({
		id_oscann: { type: String, required: true },
		host: { type: String, required: true },
		port: { type: String, required: true },
		network_status: { type: String, required: true },
		network_value: { type: String, required: true },
		ram_status: { type: String, required: true },
		ram_value: { type: String, required: true },
		cpu_status: { type: String, required: true },
		cpu_value: { type: String, required: true },
		drive_status: { type: String, required: true },
		drive_value: { type: String, required: true },
		ledservice_status: { type: String, required: true },
		ledservice_value: { type: String, required: true },
		camera_status: { type: String, required: true },
		camera_value: { type: String, required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('oscanns', OscannSchema);
