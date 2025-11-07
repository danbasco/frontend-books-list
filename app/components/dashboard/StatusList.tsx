import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { useState } from "react";
import { STATUS, type Status } from "~/types/status.type";


type Data = { 
    status: Status
}


interface Props {

    control: Control<any>;
    errors: FieldErrors<Data>
}


const StatusList: React.FC<Props> = ({ errors, control }: Props) => {

  const [statusOpen, setStatusOpen] = useState(false);

    return (
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Controller
              control={control}
              name="status"
              rules={{ required: "Status is required" }}
              render={({ field }) => (
                <div
                  className="relative"
                  tabIndex={-1}
                  onBlur={(e) => {
                    // fecha quando foco sai do conjunto (botão  lista)
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setStatusOpen(false);
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setStatusOpen((s) => !s)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setStatusOpen(false);
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setStatusOpen((s) => !s);
                      }
                    }}
                    className="w-full p-2 rounded bg-[var(--accent)] shadow-md text-[var(--text)] flex items-center justify-between"
                    aria-haspopup="listbox"
                    aria-expanded={statusOpen}
                  >
                    <span>{field.value}</span>
                    {/* seta que gira ao abrir/fechar */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 transform transition-transform duration-200 ${statusOpen ? "rotate-180" : "rotate-0"}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  {statusOpen && (
                    <ul
                      role="listbox"
                      tabIndex={-1}
                      className="absolute z-20 mt-1 w-full bg-[var(--accent)] rounded shadow-md max-h-48 overflow-auto"
                    >
                      {STATUS.map((s) => (
                        <li
                          key={s}
                          role="option"
                          tabIndex={0}
                          onClick={() => {
                            field.onChange(s);
                            setStatusOpen(false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              field.onChange(s);
                              setStatusOpen(false);
                            }
                            if (e.key === "Escape") setStatusOpen(false);
                          }}
                          className="p-2 hover:bg-[var(--primary)] cursor-pointer"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            />
            {errors?.status && <p className="text-red-500 text-sm mt-2">{String(errors.status?.message)}</p>}
          </div>
    )
}


export default StatusList;