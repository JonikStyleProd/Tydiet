import Diet from '../models/diet.model'
import extend from 'lodash/extend'
import fs from 'fs'
import errorHandler from '../helpers/dbErrorHandler'
import formidable from 'formidable'
import defaultImage from './../../client/assets/images/default.jpg'

const create = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      })
    }
    let diet = new Diet(fields)
    diet.instructor= req.profile
    if(files.image){
      diet.image.data = fs.readFileSync(files.image.path)
      diet.image.contentType = files.image.type
    }
    try {
      let result = await diet.save()
      res.json(result)
    }catch (err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

/**
 * Load diet and append to req.
 */
const dietByID = async (req, res, next, id) => {
  try {
    let diet = await Diet.findById(id).populate('instructor', '_id name')
    if (!diet)
      return res.status('400').json({
        error: "diet not found"
      })
    req.diet = diet
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve diet"
    })
  }
}

const read = (req, res) => {
  req.diet.image = undefined
  return res.json(req.diet)
}

const list = async (req, res) => {
  try {
    let diets = await Diet.find().select('name email updated created')
    res.json(diets)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const update = async (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded"
      })
    }
    let diet = req.diet
    diet = extend(diet, fields)
    if(fields.days){
      diet.days = JSON.parse(fields.days)
    }
    diet.updated = Date.now()
    if(files.image){
      diet.image.data = fs.readFileSync(files.image.path)
      diet.image.contentType = files.image.type
    }
    try {
      await diet.save()
      res.json(diet)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

const newDay = async (req, res) => {
  try {
    let day = req.body.day
    let result = await Diet.findByIdAndUpdate(req.diet._id, {$push: {days: day}, updated: Date.now()}, {new: true})
                            .populate('instructor', '_id name')
                            .exec()
    res.json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const remove = async (req, res) => {
  try {
    let diet = req.diet
    let deletediet = await diet.remove()
    res.json(deletediet)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const isInstructor = (req, res, next) => {
    const isInstructor = req.diet && req.auth && req.diet.instructor._id == req.auth._id
    if(!isInstructor){
      return res.status('403').json({
        error: "User is not authorized"
      })
    }
    next()
}

const listByInstructor = (req, res) => {
  Diet.find({instructor: req.profile._id}, (err, diets) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(diets)
  }).populate('instructor', '_id name')
}

const listPublished = (req, res) => {
  Diet.find({published: true}, (err, diets) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(diets)
  }).populate('instructor', '_id name')
}

const photo = (req, res, next) => {
  if(req.diet.image.data){
    res.set("Content-Type", req.diet.image.contentType)
    return res.send(req.diet.image.data)
  }
  next()
}
const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd()+defaultImage)
}

const listCategories = async (req, res) => {
  try {
    let diets = await Diet.distinct('category',{})
    res.json(diets)
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listSearch = async (req, res) => {
  const query = {}
  if(req.query.search)
    query.name = {'$regex': req.query.search, '$options': "i"}
  if(req.query.category && req.query.category != 'All')
    query.category =  req.query.category
  try {
    let diets = await Diet.find(query).populate('diets', '_id name').select('-image').exec()
    res.json(diets)
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}
const listLatest = async (req, res) => {
  try {
    let diets = await Diet.find({}).sort('-created').limit(5).populate('diets', '_id name').exec()
    res.json(diets)
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

export default {
  create,
  dietByID,
  read,
  list,
  remove,
  update,
  isInstructor,
  listByInstructor,
  photo,
  defaultPhoto,
  newDay,
  listPublished,
  listCategories,
  listSearch,
  listLatest
}
