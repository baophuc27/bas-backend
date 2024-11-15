export enum BerthStatus {
  AVAILABLE = 'AVAILABLE',
  MOORING = 'MOORING',
  BERTHING = 'BERTHING',
  DEPARTING = 'DEPARTING'
}
export const getBerthStatusMessages = (status: string) => {
  switch (status) {
    case BerthStatus.AVAILABLE:
      return {
        nameEn : 'Available',
        name : 'Trống'
      }
    case BerthStatus.MOORING:
      return {
        nameEn : 'Mooring',
        name : 'Neo đậu'
      }
    case BerthStatus.BERTHING:
      return {
        nameEn : 'Berthing',
        name : 'Đang cập bến'
      }
    case BerthStatus.DEPARTING:
      return {
        nameEn : 'Departing',
        name : 'Đang rời bến'
      }
    default:
      return null
  }

}

export const fromBerthStatus = (status: number | undefined) => {
  switch (status) {
    case 0:
      return BerthStatus.AVAILABLE
    case 1:
      return BerthStatus.MOORING
    case 2:
      return BerthStatus.BERTHING
    case 3:
      return BerthStatus.DEPARTING
    default:
      return null
  }
}

export const toBerthStatus = (status : BerthStatus) => {
  switch (status) {
    case BerthStatus.AVAILABLE:
      return 0
    case BerthStatus.MOORING:
      return 1
    case BerthStatus.BERTHING:
      return 2
    case BerthStatus.DEPARTING:
      return 3
  }
}