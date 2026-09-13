/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'


const createNew = async (reqBody) => {
  try {
    //Xử lý logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    //Gọi tới tầng Model để xử lý lưu bản ghi newboard vào trong Database
    const createBoard = await boardModel.createNew(newBoard)
    console.log(createBoard)

    // Lấy bản ghi board sau khi gọi
    const getNewBoard = await boardModel.findOneById(createBoard.insertedId)
    console.log(getNewBoard)

    //Làm thêm các xử lý logic khác với các Collection khác tùy đặc thù dự án
    //Thông báo email, hoặc thông báo về cho admin khi có 1 board mới được tạo

    //Trả kết quả về, trong service luôn phải có return
    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getDetails = async (boardId) => {
  try {
    //Gọi tới tầng Model để xử lý lưu bản ghi newboard vào trong Database
    const board = await boardModel.getDetails(boardId)

    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }
    //Trả kết quả về, trong service luôn phải có return
    return board
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails
}
