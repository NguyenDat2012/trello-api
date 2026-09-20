import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'

const createNew = async (reqBody) => {
  try {
    //Xử lý logic dữ liệu tùy đặc thù dự án
    const newCard = {
      ...reqBody
    }

    //Gọi tới tầng Model để xử lý lưu bản ghi newCard vào trong Database
    const createCard = await cardModel.createNew(newCard)
    // Lấy bản ghi Column sau khi gọi
    const getNewCard = await cardModel.findOneById(createCard.insertedId)

    if (getNewCard) {
      //cập nhật mảng columnOrderIds trong collection boards
      await columnModel.pushCardOrderIds(getNewCard)
    }

    //Trả kết quả về, trong service luôn phải có return
    return getNewCard
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew
}
