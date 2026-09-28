/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'


const createNew = async (reqBody) => {
  try {
    //Xử lý logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    //Gọi tới tầng Model để xử lý lưu bản ghi newboard vào trong Database
    const createBoard = await boardModel.createNew(newBoard)

    // Lấy bản ghi board sau khi gọi
    const getNewBoard = await boardModel.findOneById(createBoard.insertedId)

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

    const resBoard = cloneDeep(board)

    //Đưa card về đúng column của nó
    resBoard.columns.forEach(column => {
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
    })

    delete resBoard.cards
    //Trả kết quả về, trong service luôn phải có return
    return resBoard
  } catch (error) {
    throw error
  }
}

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }

    const updateBoard = await boardModel.update(boardId, updateData)

    return updateBoard
  } catch (error) {
    throw error
  }
}

const moveCardToDifferentColumn = async (reqBody) => {
  try {
    //Cập nhật mảng cardOrderIds của column ban đầu chứa nó (xóa _id của card ra khỏi mảng)
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })

    //Cập nhật mảng cardOrderIds của column tiếp theo (thêm _id của card vào mảng)
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })

    //cập nhật lại trường columnId mới của cái card đã kéo
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId
    })
    return { updateResult: 'Sucess' }
  } catch (error) {
    throw error
  }

  
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn
}
