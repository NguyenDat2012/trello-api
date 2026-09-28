import { StatusCodes } from 'http-status-codes'
import { columnService } from '../services/columnService.js'

const createNew = async (req, res, next) => {
  try {
    //Điều hướng dữ liệu sang tầng Service
    const createColumn = await columnService.createNew(req.body)
    //Có kết quả thì trả về cho client
    res.status(StatusCodes.CREATED).json(createColumn)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

const update = async (req, res, next) => {
  try {
    const columnId = req.params.id
    const updateColumn = await columnService.update(columnId, req.body)
    //Có kết quả thì trả về cho client
    res.status(StatusCodes.OK).json(updateColumn)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

const deleteItem = async (req, res, next) => {
  try {
    const columnId = req.params.id
    const result = await columnService.deleteItem(columnId)
    //Có kết quả thì trả về cho client
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}
export const columnController = {
  createNew,
  update,
  deleteItem
}