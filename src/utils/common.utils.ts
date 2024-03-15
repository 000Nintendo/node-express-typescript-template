import moment from 'moment'

export class CommonUtils {
  static convertStringToSlug = ({ str }: { str: string }) => {
    str = str.replace(/^\s+|\s+$/g, '') // trim
    str = str.toLowerCase()

    // remove accents, swap ñ for n, etc
    var from = 'àáãäâèéëêìíïîòóöôùúüûñç·/_,:;'
    var to = 'aaaaaeeeeiiiioooouuuunc------'

    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
    }

    str = str
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-') // collapse dashes

    return str
  }

  static removeEmptyValuesFromArray = (array: any[]) => {
    let newArray: any[] = []

    array.forEach((_item) => {
      if (_item) newArray.push(_item)
    })

    return newArray
  }

  static formatEventDates = ({
    startDate,
    endDate,
  }: {
    startDate: string
    endDate: string
  }) => {
    let momentStartDateArray = moment(startDate)
      .format('MMMM Do YYYY')
      ?.split(' ')
    let startDateFilterArray = new Date(startDate).toString()?.split(' ')
    let start_date = `${momentStartDateArray[1]} ${momentStartDateArray[0]} ${startDateFilterArray[3]}`

    let filterDate = start_date
    if (endDate) {
      let momentEndDateArray = moment(endDate)
        .format('MMMM Do YYYY')
        ?.split(' ')
      let endDateFilterArray = new Date(endDate).toString().split(' ')

      if (startDateFilterArray[3] === endDateFilterArray[3]) {
        filterDate = `${momentStartDateArray[1]} ${momentStartDateArray[0]} - ${momentEndDateArray[1]} ${momentEndDateArray[0]} ${endDateFilterArray[3]}`
      } else {
        filterDate = `${start_date}-${momentEndDateArray[1]} ${momentEndDateArray[0]} ${endDateFilterArray[3]}`
      }
    }

    return filterDate
  }
}
