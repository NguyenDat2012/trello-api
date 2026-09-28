/* eslint-disable no-useless-catch */
import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createNew = async (reqBody) => {
  try {
    //Xử lý logic dữ liệu tùy đặc thù dự án
    const newColumn = {
      ...reqBody
    }

    //Gọi tới tầng Model để xử lý lưu bản ghi newColumn vào trong Database
    const createColumn = await columnModel.createNew(newColumn)
    // Lấy bản ghi Column sau khi gọi
    const getNewColumn = await columnModel.findOneById(createColumn.insertedId)

    if (getNewColumn) {
      //Xử lý cấu trúc data ở đây trước khi trả về dữ liệu
      getNewColumn.cards = []

      //cập nhật mảng columnOrderIds trong collection boards
      await boardModel.pushColumnOrderIds(getNewColumn)
    }

    //Trả kết quả về, trong service luôn phải có return
    return getNewColumn
  } catch (error) {
    throw error
  }
}

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }

    const updateColumn = await columnModel.update(columnId, updateData)

    return updateColumn
  } catch (error) {
    throw error
  }
}

const deleteItem = async (columnId) => {
  try {
    const targetColumn = await columnModel.findOneById(columnId)
    console.log('🚀 ~ deleteItem ~ targetColumn:', targetColumn)

    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!')
    }

    //Xóa column
    await columnModel.deleteOneById(columnId)
    //xóa toàn bộ cards thuộc cái column trên
    await cardModel.deleteManyByColumnId(columnId)

    //xóa columnId trong trong mảng columnOrderIds của cái board chứa nó
    await boardModel.pullColumnOrderIds(targetColumn)
    return { deleteResult: 'Deleted successfully!' }
  } catch (error) {
    throw error
  }
}
export const columnService = {
  createNew,
  update,
  deleteItem
}
