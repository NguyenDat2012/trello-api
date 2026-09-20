/* eslint-disable no-useless-catch */
import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'

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

export const columnService = {
  createNew
}
