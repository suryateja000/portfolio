import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaChartBar, 
  FaTrophy, 
  FaCheckCircle, 
  FaRunning, 
  FaBullseye,
  FaPuzzlePiece,
  FaListAlt,
  FaChartPie,
  FaFire
} from 'react-icons/fa';
import { Line, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import './StudentProfilePage.css';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
);

const timeAgo = (days) => {
  const today = new Date();
  return new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
};


const rawData = {
  tourist: {
    problemData: {
      "handle": "tourist",
      "days": 365,
      "mostDifficultProblemSolved": "3500",
      "mostDifficultProblemDetails": {
        "name": "Gellyfish and Mayflower",
        "contestId": 2115,
        "index": "E",
        "rating": 3500,
        "tags": ["dp", "graphs"]
      },
      "totalProblemsSolved": 317,
      "totalSubmissions": 482,
      "averageRating": 1929.47,
      "averageProblemsPerDay": 0.87,
      "ratingDistribution": [
        { "rating": "800-999", "count": 42 },
        { "rating": "1000-1199", "count": 20 },
        { "rating": "1200-1399", "count": 24 },
        { "rating": "1400-1599", "count": 15 },
        { "rating": "1600-1799", "count": 21 },
        { "rating": "1800-1999", "count": 27 },
        { "rating": "2000-2199", "count": 20 },
        { "rating": "2200-2399", "count": 27 },
        { "rating": "2400-2599", "count": 24 },
        { "rating": "2600-2799", "count": 15 },
        { "rating": "2800-2999", "count": 17 },
        { "rating": "3000+", "count": 28 }
      ],
        "submissionHeatMap": {
          "Sunday": {
            "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0,
            "6": 0, "7": 1, "8": 2, "9": 3, "10": 5, "11": 4,
            "12": 6, "13": 7, "14": 8, "15": 6, "16": 5, "17": 4,
            "18": 3, "19": 2, "20": 4, "21": 3, "22": 2, "23": 1
          },
          "Monday": {
            "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0,
            "6": 1, "7": 2, "8": 4, "9": 6, "10": 8, "11": 7,
            "12": 5, "13": 9, "14": 10, "15": 8, "16": 7, "17": 6,
            "18": 5, "19": 4, "20": 6, "21": 5, "22": 3, "23": 1
          },
          "Tuesday": {
            "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0,
            "6": 1, "7": 3, "8": 5, "9": 7, "10": 9, "11": 8,
            "12": 6, "13": 8, "14": 9, "15": 7, "16": 6, "17": 5,
            "18": 4, "19": 3, "20": 5, "21": 4, "22": 2, "23": 1
          },
          "Wednesday": {
            "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0,
            "6": 2, "7": 4, "8": 6, "9": 8, "10": 10, "11": 9,
            "12": 7, "13": 9, "14": 8, "15": 6, "16": 5, "17": 4,
            "18": 3, "19": 2, "20": 4, "21": 3, "22": 2, "23": 1
          },
          "Thursday": {
            "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0,
            "6": 1, "7": 3, "8": 5, "9": 7, "10": 9, "11": 8,
            "12": 6, "13": 10, "14": 9, "15": 7, "16": 6, "17": 5,
            "18": 4, "19": 3, "20": 5, "21": 4, "22": 3, "23": 1
          },
          "Friday": {
            "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0,
            "6": 2, "7": 4, "8": 6, "9": 8, "10": 7, "11": 6,
            "12": 5, "13": 7, "14": 8, "15": 6, "16": 5, "17": 4,
            "18": 6, "19": 8, "20": 9, "21": 7, "22": 5, "23": 2
          },
          "Saturday": {
            "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0,
            "6": 0, "7": 1, "8": 3, "9": 5, "10": 7, "11": 6,
            "12": 8, "13": 9, "14": 7, "15": 5, "16": 4, "17": 3,
            "18": 5, "19": 7, "20": 8, "21": 6, "22": 4, "23": 2
          }
        },
      "periodStats": {
        7: {
          "mostDifficult": 2400,
          "totalSolved": 23,
          "averageRating": 1650,
          "averagePerDay": 3.3
        },
        30: {
          "mostDifficult": 2800,
          "totalSolved": 95,
          "averageRating": 1750,
          "averagePerDay": 3.2
        },
        90: {
          "mostDifficult": 3200,
          "totalSolved": 280,
          "averageRating": 1850,
          "averagePerDay": 3.1
        }
      }
    },
    contestData: [
      {
        "contestId": 2000,
        "contestName": "Codeforces Round 960 (Div. 1 + Div. 2)",
        "rank": 2,
        "oldRating": 3947,
        "newRating": 3925,
        "ratingChange": -22,
        "Date": "2025-06-05",
        "problemsUnsolved": 1
      },
      {
        "contestId": 2005,
        "contestName": "Codeforces Round 961 (Div. 1 + Div. 2)",
        "rank": 1,
        "oldRating": 3925,
        "newRating": 4000,
        "ratingChange": 75,
        "Date": "2025-06-15",
        "problemsUnsolved": 0
      },
      {
        "contestId": 2010,
        "contestName": "Codeforces Round 962 (Div. 1 + Div. 2)",
        "rank": 1,
        "oldRating": 4000,
        "newRating": 4080,
        "ratingChange": 80,
        "Date": "2025-05-25",
        "problemsUnsolved": 0
      },
      {
        "contestId": 2015,
        "contestName": "Codeforces Round 963 (Div. 1 + Div. 2)",
        "rank": 1,
        "oldRating": 4080,
        "newRating": 4150,
        "ratingChange": 70,
        "Date": "2025-05-05",
        "problemsUnsolved": 0
      },
      {
        "contestId": 2020,
        "contestName": "Codeforces Round 964 (Div. 1 + Div. 2)",
        "rank": 1,
        "oldRating": 4150,
        "newRating": 4220,
        "ratingChange": 70,
        "Date": "2025-01-15",
        "problemsUnsolved": 0
      }
    ]
  }
};

const CodeforcesSubmissionHeatmap = ({ submissionHeatMap }) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const stats = {
    total: 640,
    active: 124,
    max: 10,
    average: 5.2
  };

  const getIntensity = (count) => {
    if (count === 0) return 'level-0';
    if (count <= 2) return 'level-1';
    if (count <= 5) return 'level-2';
    if (count <= 8) return 'level-3';
    return 'level-4';
  };

  return (
    <div className="pro-activity-layout">

      <div className="pro-grid-layout">
        {/* Statistics Panel */}
        <div className="pro-stats-panel">
          <div className="pro-stats-header">
            <h3>Activity Overview</h3>
            <p>Submissions by Hour & Day</p>
          </div>
          <div className="pro-stats-grid">
            <div className="pro-stat-card">
              <span className="pro-stat-value">{stats.total}</span>
              <span className="pro-stat-label">Total Submissions</span>
            </div>
            <div className="pro-stat-card">
              <span className="pro-stat-value">{stats.active}</span>
              <span className="pro-stat-label">Active Periods</span>
            </div>
            <div className="pro-stat-card">
              <span className="pro-stat-value">{stats.max}</span>
              <span className="pro-stat-label">Busiest Hour</span>
            </div>
            <div className="pro-stat-card">
              <span className="pro-stat-value">{stats.average}</span>
              <span className="pro-stat-label">Average</span>
            </div>
          </div>
          <div className="pro-legend">
            <span className="pro-legend-label">Less</span>
            <div className="pro-legend-colors">
              <div className="pro-legend-cell level-0"></div>
              <div className="pro-legend-cell level-1"></div>
              <div className="pro-legend-cell level-2"></div>
              <div className="pro-legend-cell level-3"></div>
              <div className="pro-legend-cell level-4"></div>
            </div>
            <span className="pro-legend-label">More</span>
          </div>
        </div>

        <div className="pro-heatmap-panel">
          <div className="pro-heatmap-grid">
            
            <div className="pro-heatmap-body">
              {daysOfWeek.map(day => (
                <div key={day} className="pro-day-row">
                  <div className="pro-day-label">{day}</div>
                  <div className="pro-activity-cells">
                    {hours.map(hour => (
                      <div
                        key={hour}
                        className={`pro-activity-cell ${getIntensity(submissionHeatMap[day.replace('Mon', 'Monday').replace('Tue', 'Tuesday').replace('Wed', 'Wednesday').replace('Thu', 'Thursday').replace('Fri', 'Friday').replace('Sat', 'Saturday').replace('Sun', 'Sunday')][hour])}`}
                        title={`${submissionHeatMap[day.replace('Mon', 'Monday').replace('Tue', 'Tuesday').replace('Wed', 'Wednesday').replace('Thu', 'Thursday').replace('Fri', 'Friday').replace('Sat', 'Saturday').replace('Sun', 'Sunday')][hour]} submissions`}
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



const StudentProfilePage = () => {
  const { codeHandle } = useParams();
  const [contestPeriod, setContestPeriod] = useState(365);
  const [problemPeriod, setProblemPeriod] = useState(30);
  const [loading,isLoading] = useState(true)
  const [studentData,setStudentData] = useState({});




useEffect(() => {
  const fetchData = async () => {
    const contestdata = await axios.get(`https://codeforces-profile.onrender.com/contest/contestsdata/${codeHandle}?days=365`);
    const problemData = await axios.get(`https://codeforces-profile.onrender.com/problem/data/${codeHandle}`);
    console.log("hihihiihihiihiihiiihiiihi");
    setStudentData({
      problemData: problemData.data,
      contestData: contestdata.data
    });
    isLoading(false);
  };

  fetchData();
}, [codeHandle]);







  const filteredContests = useMemo(() => {
    if (!studentData) return [];
    const filterDate = timeAgo(contestPeriod);
    console.log(studentData)
    if(!studentData.contestData){
      return []
    }
    return studentData.contestData
      .filter(c => new Date(c.Date) >= filterDate)
      .sort((a, b) => new Date(b.Date) - new Date(a.Date));
  }, [contestPeriod, studentData]);

  const currentProblemStats = useMemo(() => {
    if (!studentData) return null;
    if(!studentData.problemData) return {};
    console.log("ogogogo",studentData)
    return  {
      mostDifficult: studentData.problemData.mostDifficultProblemSolved,
      totalSolved: studentData.problemData.totalProblemsSolved,
      averageRating: studentData.problemData.averageRating,
      averagePerDay: studentData.problemData.averageProblemsPerDay
    };
  }, [problemPeriod, studentData]);


  if(loading){
    return(<><div><h1>Loading...</h1></div></>)
   }

  if (!studentData) {
    return (
      <div className="profile-container">
        <h2>User '{codeHandle}' not found.</h2>
      </div>
    );
  }

  const { problemData } = studentData;

  const ratingChartData = {
    labels: filteredContests.map(c => c.Date).reverse(),
    datasets: [{
      label: 'Rating',
      data: filteredContests.map(c => c.newRating).reverse(),
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#2563eb',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 4,
    }],
  };

  const ratingDistributionChartData = {
    labels: problemData.ratingDistribution.map(item => item.rating.trim()),
    datasets: [{
      label: 'Problems Solved',
      data: problemData.ratingDistribution.map(item => item.count),
      backgroundColor: [
        '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
        '#c084fc', '#d8b4fe', '#e9d5ff', '#f3e8ff',
        '#fef3c7', '#fed7aa', '#fecaca', '#f87171'
      ],
      borderColor: '#ffffff',
      borderWidth: 2,
      borderRadius: 4,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#2563eb',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280', font: { size: 11 } },
      },
      y: {
        grid: { color: '#f1f5f9' },
        ticks: { color: '#6b7280', font: { size: 11 } },
      },
    },
  };
 
   
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Codeforces : {problemData.handle}</h1>
        <p>performance dashboard</p>
      </div>

      <div className="dashboard-grid">

        <div className="contest-history-section">
          <h2><FaTrophy />Contest History</h2>
          <div className="filter-section">
            <label className="filter-label">Time Period</label>
            <div className="filter-buttons">
              {[30, 90, 365].map(days => (
                <button
                  key={days}
                  onClick={() => setContestPeriod(days)}
                  className={contestPeriod === days ? 'active' : ''}
                >
                  Last {days} Days
                </button>
              ))}
            </div>
          </div>
          <div className="rating-graph-container">
            <h3>Rating Progress</h3>
            <div className="chart-wrapper">
              <Line data={ratingChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Problem Solving Section */}
        <div className="problem-solving-section">
          <h2><FaPuzzlePiece />Problem Solving Data</h2>
          <div className="filter-section">
            <label className="filter-label">Analysis Period</label>
            
          </div>
          <div className="problem-stats-grid">
            <div className="problem-stat-card">
              <FaBullseye />
              <div className="stat-label">Most Difficult</div>
              <p className="stat-value">
                <Link
                  to={`https://codeforces.com/contest/${problemData.mostDifficultProblemDetails.contestId}/problem/${problemData.mostDifficultProblemDetails.index}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {currentProblemStats.mostDifficult}
                </Link>
              </p>
            </div>
            <div className="problem-stat-card">
              <FaCheckCircle />
              <div className="stat-label">Total Solved</div>
              <p className="stat-value">{currentProblemStats.totalSolved}</p>
            </div>
            <div className="problem-stat-card">
              <FaChartBar />
              <div className="stat-label">Avg Rating</div>
              <p className="stat-value">{Math.round(currentProblemStats.averageRating)}</p>
            </div>
            <div className="problem-stat-card">
              <FaRunning />
              <div className="stat-label">Per Day</div>
              <p className="stat-value">{currentProblemStats.averagePerDay}</p>
            </div>
          </div>
        </div>

        {/* Contest Details Section */}
        <div className="contest-details-section">
          <h2><FaListAlt />Contest Performance Details</h2>
          <div className="contest-list-container">
            <table className="contest-table">
              <thead>
                <tr>
                  <th>Contest</th>
                  <th>Rank</th>
                  <th>Rating Change</th>
                  <th>Unsolved</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredContests.map((contest) => (
                  <tr key={contest.contestId}>
                    <td>
                      <Link 
                        to={`https://codeforces.com/contest/${contest.contestId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {contest.contestName}
                      </Link>
                    </td>
                    <td>#{contest.rank}</td>
                    <td>
                      <span className={`rating-change ${contest.ratingChange > 0 ? 'positive' : 'negative'}`}>
                        {contest.oldRating} → {contest.newRating} 
                        ({contest.ratingChange > 0 ? '+' : ''}{contest.ratingChange})
                      </span>
                    </td>
                    <td>{contest.problemsUnsolved}</td>
                    <td>{new Date(contest.Date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rating Distribution Section */}
        <div className="rating-distribution-section">
          <h2><FaChartPie />Rating Distribution</h2>
          <div className="rating-chart-container">
            <div className="chart-wrapper">
              <Bar data={ratingDistributionChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="heatmap-section">
          <h2><FaFire />Submission Activity</h2>
          <CodeforcesSubmissionHeatmap submissionHeatMap={problemData.submissionHeatMap} />
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
