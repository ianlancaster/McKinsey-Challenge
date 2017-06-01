import React, { Component } from 'react'
import moment from 'moment'
import './HomeView.scss'

const sampleData = [
  { title: 'Sample Item', description: 'Sample description', start: '9:30 am', end: '11:30 am' },
  { title: 'Sample Item', description: 'Sample description', start: '6:00 pm', end: '7:00 pm' },
  { title: 'Sample Item', description: 'Sample description', start: '6:30 pm', end: '7:30 pm' },
  { title: 'Sample Item', description: 'Sample description', start: '7:00 pm', end: '8:00 pm' }
]

class HomeView extends Component {
  constructor () {
    super()
    this.state = {
      calendarHeight: 0,
      gridHeight: 0
    }
  }

  componentDidMount () {
    const setCalHeight = () => {
      const calendar = document.querySelectorAll('.calendar')
      const calendarHeight = calendar[0].scrollHeight
      this.setState({
        calendarHeight,
        gridHeight: calendarHeight / 24
      })
    }

    setTimeout(setCalHeight, 500)
  }

  renderRows () {
    const rows = []

    const sharedStyles = {
      height: this.state.gridHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }

    const renderTime = (i) => {
      if (i === 6) return '12:00 pm'
      if (i < 6) return `${9 + i / 2}:00 am`
      return `${-3 + i / 2}:00 pm`
    }

    for (var i = 0; i < 25; i++) {
      if (i % 2) {
        rows.push(<div key={i} style={{
          ...sharedStyles
        }}>{`???`}</div>)
      } else {
        rows.push(<div key={i} style={{
          ...sharedStyles
        }}>{renderTime(i)}</div>)
      }
    }

    return rows
  }

  renderTile = ({ todayIso, apt, calStart, calDur, i }) => {
    const { calendarHeight } = this.state
    const aptStart = moment(`${todayIso} ${apt.start}`).unix()
    const aptEnd = moment(`${todayIso} ${apt.end}`).unix()

    // resolve collisions
      // loop determine if start or endtime falls within start or end of any others
      // if (collision) && (selfStart > compareStart) && compare.shifted = false {
      //  width = 50%
      //  left = calWidth / 2
      //  sampleData[i] = { ...sampleData[i], shifted: true }
      // }

    return (
      <div className='appointment' style={{
        width: '100%',
        height: `${(aptEnd - aptStart) / calDur * calendarHeight}px`,
        position: 'absolute',
        top: (aptStart - calStart) / calDur * calendarHeight
      }}>
        <p className='apt-title'>{apt.title}</p>
        <p className='apt-desc'>{apt.description}</p>
      </div>
    )
  }

  renderTiles () {
    let tiles = []

    const today = new Date()
    const dd = (today.getDate()).toString.length > 1 ? today.getDate() : `0${today.getDate()}`
    const mm = (today.getMonth() + 1).toString.length > 1 ? today.getMonth() + 1 : `0${today.getMonth() + 1}`
    const yyyy = today.getFullYear()
    const todayIso = `${yyyy}-${mm}-${dd}`
    const calStart = moment(`${todayIso} 9:00 am`).unix()
    const calDur = moment(`${todayIso} 8:00 pm`).unix() - calStart
    const Tile = this.renderTile

    sampleData.forEach((apt, i) => {
      tiles.push(<Tile key={i} {...{ todayIso, apt, calStart, calDur }} />)
    })

    return tiles
  }

  render () {
    return (
      <section className='calendar'>
        <section className='calendar-times' style={{ marginTop: this.state.gridHeight / -2 }}>
          {this.renderRows()}
        </section>
        <section className='calendar-body'>
          {this.renderTiles()}
        </section>
      </section>
    )
  }
}

export default HomeView
