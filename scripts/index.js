var Container = React.createClass({
  start: function() {
    if (this.state.time == 0) return; // Disable start when time complete
    var changeTime = this.changeTime;
    changeTime(-1);
    var newTimer = setInterval(function(){changeTime(-1); }, 1000); // Decrement time every 1000 ms
    this.setState({timer: newTimer});
  },
  stop: function() { // Pause the timer
    clearInterval(this.state.timer);
    this.setState({timer: 0}); // Reset timer variable
  },
  changeTime: function(diff) { // Change the time by diff seconds
    var newTime = this.state.time + diff;

    if (newTime >= 0) // Set the time if valid
      this.setState({time: newTime});
    if (newTime == 0) // End timer when time is complete
      clearInterval(this.state.timer);
  },
  handleSelect: function(name) { // Call when a new name is selected
   
    this.setState({current: name, time: 180, timer: 0});
    
    clearInterval(this.state.timer);
    this.removeName(name);
    this.start();
  },
  removeName: function(name) { // Remove a name from the speaking list
    var newList = this.state.list;
    var i = newList.indexOf(name);
    newList.splice(i, 1);
    this.setState({list: newList});
   
    /* Update the speaking counts */ 
    var newCount = this.state.counts;
    if (newCount[name]) newCount[name]++;
    else newCount[name] = 1;
    this.setState({count: newCount});
  },
  handleAddName: function(name) { // Call when a new name is added
    var list = this.state.list;
    
    var i = list.length - 1;
    var newList = list.concat([name]);

    var newCounts = this.state.counts;
    if (newCounts[name] == undefined) {
      newCounts[name] = 0;
      this.setState({"counts":newCounts});
    }

    this.sortList(newList);

  },
  sortList: function(list) {
    /* Sort the speaking list with first-time speaking 
     */
    var newList = list;
    var counts = this.state.counts;

    var c = newList.length - 1;
    while (counts[newList[c]] < counts[newList[c-1]]) {
      var temp = newList[c];
      newList[c] = newList[c-1];
      newList[c-1] = temp;
      c--;
    }
    this.setState({"list":newList});
  },
  componentDidMount: function() {
    // this.sortList(this.state.list);
  },
  getInitialState: function() {
    return {
            list: [], counts: {},
            time: 180, timer: 0, // Current time remaining, and ID for the timer interval
            current: "", // Current name displayed
            // list: ["Peter Zhang", "Auni Ahsan", "Ben Coleman", "Vere-Marie Khan"], // Ordered Speaking List
            // counts: {"Peter Zhang": 5, "Auni Ahsan": 4, "Ben Coleman": 3, "Vere Marie Khan": 1} // Dictionary of speaking time counts
           }
  },
  render: function() {
    console.log(this.state.list);
    console.log(this.state.counts);
    return (
      <div className="container">
        <div className="topbar"><h1><b>Speak</b>Out</h1></div><br/>
        <SpeakerList add={this.handleAddName} list={this.state.list} select={this.handleSelect} 
                     remove={this.removeName}/>
        <Current name={this.state.current} time={this.state.time} timer={this.state.timer} 
                 start={this.start} stop={this.stop} changeTime={this.changeTime} />
      </div>
    );
  }
});

var SpeakerList = React.createClass({ // Contains the sidebar
  render: function() {
    var select = this.props.select;
    var remove = this.props.remove;
    var speakerNodes = this.props.list.map(function (speaker) {
      return (
        <Speaker key={speaker} name={speaker} select={select} remove={remove}/>
      );
    });

    return (
      <div className="sidebar">
        <Form add={this.props.add} />
        <hr />
        <div className="list">
          {speakerNodes} 
        </div>
      </div>
    );
  }
});   

var Form = React.createClass({
  componentDidMount: function() {
    var input = document.getElementById("input");
    var form = new Awesomplete(input, {
      minchars: 1,
      maxItems: 3,
      autoFirst: true,
      list: ["Ben Coleman", "Ryan Gomes", "Jasmine Denike", "Sania Khan", "Vere Marie Khan", "Akshan Bansal", "Ebi Agbeyegbe", "Nick Grant", "Khrystyna Zhuk", "Nicole Thompson", "Angelo Gio Matteo", "Steve Warner", "Auni Ahsan", "Daman Singh", "Ryan Hume", "Jess Afonso", "Priya Kaur", "Danielle Sardella", "Danni Zuo", "Peter Zhang", "Zachary Bist", "Matthew Celestial", "Cailyn Stewart", "Nathan Gibson", "Anastasia Harovska", "Riaz Sayani-Mulji", "Rebecca Jackson", "Caitlin Pascoe", "Ilan Zimner", "Jason Lo", "Mathias Memmel", "Ernest Manalo", "John Deepak Sundara", "Nia Imara Barberousse", "Carlos Antonio Fiel", "Josh Calafato", "Raffi Dergalstanian", "Emily Xu", "Adriana Menghi", "Nasrin Gh", "Emerson Calcada", "Maheen Farrukh", "Abdulla Omari", "Falhad Mohamoud", "Farah Noori", "Hashim Yussuf", "Sana Chishti"] 
    });
    this.refs.name.focus(); 
  },
  addName: function(e) {
    e.preventDefault();
    var name = this.refs.name.value.trim();

    if (!name) {
      return;
    }
    this.props.add(name);
    this.refs.name.value = '';
    return;
  },
  render: function() {
    return (
      <form id="form" className="form" onSubmit={this.addName}>
        <input className="awesomplete" id="input" type="text" ref="name" />
      </form>
    );
  }
});

var Speaker = React.createClass({
  render: function() {
    return (
      <div className="speaker" onClick={this.handleClick}>
        <span className="speakerName">
          {this.props.name}
        </span>
        <span className="remove" onClick={this.handleRemove}/>
      </div>
    );
  },
  handleClick: function(e) {
    e.preventDefault();
    this.props.select(this.props.name);
  },
  handleRemove: function(e) {
    e.stopPropagation();
    this.props.remove(this.props.name);
  }
});

var Current = React.createClass({
  render: function() {
    return (
      <div className="current">
        <span className="curName">
          {this.props.name == "" ? <br/> : this.props.name}
        </span>
        <Timer time={this.props.time} timer={this.props.timer} 
               start={this.props.start} stop={this.props.stop} 
               changeTime={this.props.changeTime} />
      </div>
    );
  }
});

var Timer = React.createClass({
  getMin: function() {
    return Math.floor(this.props.time / 60);
  },
  getSec: function() {
    var seconds = this.props.time % 60; 
    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    return seconds;
  },
  handleClick: function() {
    var timer = this.props.timer;

    if (timer == 0) { // Timer is not running, or paused
      this.props.start();
    } 
    else { // Timer is running
      this.props.stop();
    }
  },
  handleTime: function(e) { 
    this.props.changeTime(e.target.className == "increase" ?
                          60 : -60);
  },
  render: function() {
    return (
      <div className="timerContainer">
        <btn className="timerMain" onClick={this.handleClick}>
          {this.getMin()}:{this.getSec()}<br/>
        </btn>
        <div className="timerButtons">
          <btn className="increase" type="button" onClick={this.handleTime}>+</btn>
          <btn className="decrease" type="button" onClick={this.handleTime}>
            {String.fromCharCode(8722)}
          </btn>
          <btn className="pause" type="button" onClick={this.handleClick}>
              {this.props.timer == 0 ?
               String.fromCharCode(9658) :
               String.fromCharCode(10073) + String.fromCharCode(10073) }
          </btn>
        </div> 
           
      </div>
    ); 
  } 
});

ReactDOM.render(
  <Container />,
  document.getElementById('hook')
);

