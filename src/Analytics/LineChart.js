import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

export default function LineChart(props) {
  let labels;
  let dataValues;
  if (props.data.length) {
    labels = props.data.map((row) =>
      moment(new Date(row.startTime)).format("MMM DD")
    );
    dataValues = props.data.map((row) => row.data);
  }

  const data = {
    labels,
    datasets: [
      {
        label: "Weight",
        data: dataValues,
        borderColor: "#ff6384",
        backgroundColor: "#ff638450",
      },
    ],
  };

  return <Line options={options} data={data} />;
}
