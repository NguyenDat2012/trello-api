import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/ApiError.js'
import { BOARD_TYPE } from '~/utils/constants.js'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      //Có thể ghi đè lại message mặc định của Joi bằng cách sử dụng .messages()
      'any.required': 'Title is required',
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title cannot exceed 50 characters',
      'string.trim': 'Title cannot have leading or trailing whitespace'
    }),
    description: Joi.string().required().min(3).max(256).trim().strict().messages({
      'any.required': 'Description is required',
      'string.empty': 'Description cannot be empty',
      'string.min': 'Description must be at least 3 characters long',
      'string.max': 'Description cannot exceed 256 characters',
      'string.trim': 'Description cannot have leading or trailing whitespace'
    }),
    type: Joi.string().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE).required()
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

export const boardValidation = {
  createNew
}