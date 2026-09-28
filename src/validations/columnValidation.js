import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/ApiError.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().min(3).max(50).trim().strict()
  })
  try {
    //Chỉ định abortEarly: fasle để Joi trả về tất cả các lỗi thay vì dừng lại sau lỗi đầu tiên
    await correctCondition.validateAsync(req.body, { abortEarly: false })

    //Validation thành công, tiếp tục xử lý request
    next()

  } catch (error) {
    const errorMessages = new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessages)
    next(customError)
  }
}

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    boardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().min(3).max(50).trim().strict(),
    cardOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    )
  })
  try {
    //Chỉ định abortEarly: fasle để Joi trả về tất cả các lỗi thay vì dừng lại sau lỗi đầu tiên
    await correctCondition.validateAsync(req.body, { 
      abortEarly: false,
      //Đối với trường hợp update, cho phép unknown để không cần đẩy một số field lên
      allowUnknown: true
    })

    //Validation thành công, tiếp tục xử lý request
    next()

  } catch (error) {
    const errorMessages = new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessages)
    next(customError)
  }
}

const deleteItem = async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  })
  try {
    //Chỉ định abortEarly: fasle để Joi trả về tất cả các lỗi thay vì dừng lại sau lỗi đầu tiên
    await correctCondition.validateAsync(req.params)

    //Validation thành công, tiếp tục xử lý request
    next()

  } catch (error) {
    const errorMessages = new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessages)
    next(customError)
  }
}

export const columnValidation = {
  createNew,
  update,
  deleteItem
}