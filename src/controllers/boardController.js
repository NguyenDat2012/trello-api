import { StatusCodes } from 'http-status-codes'
import { boardService } from '../services/boardService.js'

const createNew = async (req, res, next) => {
  try {
    //Điều hướng dữ liệu sang tầng Service
    const createBoard = await boardService.createNew(req.body)

    //throw new ApiError(StatusCodes.BAD_REQUEST, 'API create new board error: Bad Request')

    //Có kết quả thì trả về cho client
    res.status(StatusCodes.CREATED).json(createBoard)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

const getDetails = async (req, res, next) => {
  try {
    // console.log('req.params: ', req.params)

    const boardId = req.params.id

    //Điều hướng dữ liệu sang tầng Service
    const board = await boardService.getDetails(boardId)

    //Có kết quả thì trả về cho client
    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

export const boardController = {
  createNew,
  getDetails
}