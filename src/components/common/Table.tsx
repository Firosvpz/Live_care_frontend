interface PropsType {
    columns: number
}

const TableShimmer = ({columns}: PropsType) => {
  return (
    <tbody className="animate-pulse bg-white">
      {[...Array(5)].map((_, index) => (
        <tr key={index} className="border-b border-gray-200">
          {[...Array(columns)].map((_, cellIndex) => (
            <td key={cellIndex} className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className={`h-4 bg-gray-200 rounded ${cellIndex === 0 ? 'w-16' : 'w-24'}`}></div>
              </div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default TableShimmer;