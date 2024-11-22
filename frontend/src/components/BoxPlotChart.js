import React from 'react';
import Plot from 'react-plotly.js';

const BoxPlotChart = ({ data }) => {
  // Prepare the boxplot trace using quartile data
  const boxTrace = {
    type: 'box',
    x: data.map(subject => subject.name),
    q1: data.map(subject => subject.q1),
    median: data.map(subject => subject.median),
    q3: data.map(subject => subject.q3),
    lowerfence: data.map(subject => subject.min),
    upperfence: data.map(subject => subject.max),
    name: 'Cohort',
    boxpoints: false,
    // marker: { color: 'black' },
    line: { color: '#2171B7' },
    showlegend: true,
    // width: 0.5, // Set the width between 0 and 1
  };

  // Prepare the scatter trace for the student's marks
  const scatterTrace = {
    type: 'scatter',
    x: data.map(subject => subject.name),
    y: data.map(subject => subject.mark),
    mode: 'markers',
    marker: { color: '#F97171', size: 10 },
    name: 'Student Mark',
    showlegend: true,
  };

  const traces = [boxTrace, scatterTrace];

  const layout = {
    // title: 'Student Marks vs Cohort',
    xaxis: { 
      title: { 
        text: 'Subject',
        font: {
          weight: 'bold'
        }
      } , 
      type: 'category' 
    },
    yaxis: { title: 'Marks' },
    boxmode: 'group',
    boxgap: 0.5,       // Increase this value to increase the gap between boxes
    boxgroupgap: 0.5,  // Increase to add more space between groups
    paper_bgcolor: '#F8FAFE',   // Set the overall background color
    plot_bgcolor: '#F8FAFE'
  };

  return (
    <div className="subjects">
      <div className="title-1">Academic Performance</div>
      < div className="boxplot-container">
        <Plot
          data={traces}
          layout={layout}
          style={{flex: '1', display: 'flex'}}
        />
      </div>
    </div>
  );
};

export default BoxPlotChart;
