// ========== mainController
// import all modules
const express				= require('express');

// import several models
const contentModel	= require('../models/ContentModel');

exports.editHeader	= function(req, res) {
	if(!req.body.title || !req.body.subtitle) {
		return res.status(200).json({
			status: 200,
			type: 'warning',
			success: 'false',
			message: 'Form kosong'
		});
	}

	if(req.body.title.length > 40 || req.body.subtitle.length > 150) {
		return res.status(200).json({
			status: 200,
			type: 'warning',
			success: 'false',
			message: 'title max 40 kata & subtitle max 150 kata'
		});
	}

	contentModel.editHeader(req.body, (message, status, type, success) => {
		res.status(status).json({
			status,
			type,
			success,
			message
		});
	});
}

exports.getHeader = function(req, res) {
	contentModel.getHeader((message, status, type, success, result = []) => {
		res.status(status).json({
			status,
			type,
			success,
			message,
			result
		});
	});
}

exports.getAbout	= function(req, res) {
	contentModel.getAbout((message, status, type, success, result = []) => {
		res.status(status).json({
			status,
			type,
			success,
			message,
			result
		});
	});
}

exports.editAbout = function(req, res) {
	if(!req.body.text) {
		return res.status(200).json({
			status: 200,
			type: 'warning',
			success: 'false',
			message: 'Form kosong'
		});
	}

	if(req.body.text.length > 500) {
		return res.status(200).json({
			status: 200,
			type: 'warning',
			success: 'false',
			message: 'Text about tidak boleh lebih dari 500 kata'
		});
	}

	contentModel.editAbout(req.body.text, (message, status, type, success) => {
		res.status(status).json({
			status,
			type,
			success,
			message
		});
	});
}

exports.addSkill = function(req, res) {
	if(!req.body.skill || !req.body.level) {
		return res.status(200).json({
			status: 200,
			type: 'warning',
			success: 'false',
			message: 'Form kosong'
		});
	}

	if(req.body.skill.length > 20) {
		return res.status(200).json({
			status: 200,
			type: 'warning',
			success: 'false',
			message: 'Judul skill max 20 kata'
		});
	}

	if(parseInt(req.body.level) > 100) {
		return res.status(200).json({
			status: 200,
			type: 'warning',
			success: 'false',
			message: 'max level skill 100%'
		});
	}

	contentModel.addSkill(req.body, (message, status, type, success) => {
		res.status(status).json({
			status,
			type,
			success,
			message
		});
	});
}

exports.getSkills		= function(req, res) {
	contentModel.getSkills((message, status, type, success, result = []) => {
		res.status(status).json({
			status,
			type,
			success,
			message,
			result
		});
	});
}

exports.removeSkill	= function(req, res) {
	const id = req.params.id;

	contentModel.removeSkill(id, (message, status, type, success) => {
		res.status(status).json({
			status,
			type,
			success,
			message
		});
	});
}

exports.getSkillById	= function(req, res) {
	const id	= req.params.id;
	contentModel.getSkillById(id, (message, status, type, success, result = []) => {
		res.status(status).json({
			status,
			type,
			success,
			message,
			result
		});
	});
}

exports.editSkill = function(req, res) {
	if(!req.body.skill || !req.body.level || !req.body.id) {
		return res.status(200).json({
			status: 200,
			type: 'warning',
			success: 'false',
			message: 'form kosong'
		});
	}

	if(req.body.skill.length > 20) {
		return res.status(200).json({
			status: 200,
			type: 'warning',
			success: 'false',
			message: 'judul skill maks 20 kata'
		});
	}

	if(parseInt(req.body.level) > 100) {
		return res.status(200).json({
			status: 200,
			type: 'warning',
			success: 'false',
			message: 'level skill max 100%'
		});
	}

	contentModel.editSkill(req.body, (message, status, type, success) => {
		res.status(status).json({
			status,
			type,
			success,
			message
		});
	});
}
