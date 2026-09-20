import { StatusCodes } from 'http-status-codes'
import { cardService } from '../services/cardService'

const createNew = async (req, res, next) => {
  try {
    //Điều hướng dữ liệu sang tầng Service
    const createCard = await cardService.createNew(req.body)
    //Có kết quả thì trả về cho client
    res.status(StatusCodes.CREATED).json(createCard)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

export const cardController = {
  createNew
}