export default function LoadingPatient() {
  return (
    <tr className="animate-pulse">
      <td className="whitespace-nowrap px-6 py-4">
        <span className="inline-block h-6 w-28 rounded bg-slate-500" />
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex space-x-4">
          <span className="inline-block h-6 w-28 rounded bg-slate-500" />
          <span className="inline-block h-6 w-9 rounded bg-slate-500" />
          <span className="inline-block h-6 w-16 rounded bg-slate-500" />
        </div>
      </td>
    </tr>
  );
}
