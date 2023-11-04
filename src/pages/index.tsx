import { FormEvent, useEffect, useState } from "react";
import axios from "axios";

// components
import FormInput from "@/components/FormInput";
import useLoading from "@/hooks/useSnackbar";

// type
type projectDataType = {
  id: string;
  name: string;
  client: string;
  progress: string;
  deadline: string;
  nilai: string;
};

type dataStateType = null | "insert" | "update" | "delete";

export default function Home() {
  const [projectData, setProjectData] = useState<projectDataType[]>([]);
  const [dataState, setDataState] = useState<dataStateType>(null);
  const [updateIndex, setUpdateIndex] = useState(-1);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const { SnackBar, showSnack } = useLoading();
  const [nextDataSkip, setNextDataSkip] = useState(0);

  async function getData({ next, prev }: { next?: number; prev?: number }) {
    showSnack(true, "Memuat data ...", "loading");
    let theNext: number = 0;

    if (typeof next !== "undefined") {
      theNext = nextDataSkip + next;
    }

    if (typeof prev !== "undefined") {
      theNext = nextDataSkip - prev < 0 ? 0 : nextDataSkip - prev;
    }

    const response = await axios.get(`http://localhost:3000/api/project?skip=${theNext}`);
    showSnack(true, "Data berhasil dimuat", "success");

    if (response.data.length !== 0) {
      setProjectData(response.data);
      if (typeof next !== "undefined") {
        setNextDataSkip(nextDataSkip + next);
      }
      if (typeof prev !== "undefined") {
        setNextDataSkip(nextDataSkip - prev < 0 ? 0 : nextDataSkip - prev);
      }
    }

    setTimeout(() => {
      showSnack(false, null, null);
    }, 1000);
  }

  async function handleSubmit(e: FormEvent) {
    showSnack(true, "Menyimpan data ...", "loading");
    e.preventDefault();
    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);
    const formDataJSON = Object.fromEntries(formData.entries());

    const response = await axios.post("http://localhost:3000/api/project", formDataJSON);

    const temp = [...projectData];
    temp.push(response.data);
    setProjectData(temp);
    showSnack(true, "Data berhasil ditambah", "success");
    setTimeout(() => {
      showSnack(false, null, null);
    }, 2000);
    setDataState(null);
    setHighlightIndex(temp.length - 1);
    setTimeout(() => {
      setHighlightIndex(-1);
    }, 3000);
  }

  async function handleUpdate(e: FormEvent) {
    e.preventDefault();
    showSnack(true, "Memperbarui data ...", "loading");
    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);
    const formDataJSON = Object.fromEntries(formData.entries());
    formDataJSON["id"] = projectData[updateIndex].id;

    const response = await axios.put("http://localhost:3000/api/project", formDataJSON);

    const temp = [...projectData];
    temp[updateIndex] = response.data;
    setProjectData(temp);

    showSnack(true, "Data berhasil diperbarui", "success");
    setTimeout(() => {
      showSnack(false, null, null);
    }, 3000);
    setDataState(null);

    setTimeout(() => {
      setUpdateIndex(-1);
    }, 3000);
  }

  async function handleDelete(id: string) {
    showSnack(true, "Menghapus data ...", "loading");
    const response = await axios.delete(`http://localhost:3000/api/project?id=${id}`);
    const temp = projectData.filter((item) => item.id !== response.data.id);
    setProjectData(temp);
    showSnack(true, "Data berhasil dihapus", "success");
    setTimeout(() => {
      showSnack(false, null, null);
    }, 3000);
  }

  useEffect(() => {
    getData({ next: 0 });
  }, []);

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <SnackBar />
      {dataState === "insert" ? (
        <form className="border p-5 mb-10 bg-slate-100" onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-3">
            <FormInput label="Nama Project" id="name" type="text" />
            <FormInput label="Nama Client" id="client" type="text" />
            <FormInput label="Progress" id="progress" type="text" />
            <FormInput label="Deadline" id="deadline" type="date" />
            <FormInput label="Nilai" id="nilai" type="text" />
          </div>
          <div className="flex gap-2 items-center mt-7">
            <button
              type="submit"
              className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 text-sm"
            >
              <svg viewBox="0 0 512 512" fill="currentColor" className="w-4 h-4">
                <path d="M465.94 119.76l-73.7-73.7A47.68 47.68 0 00358.3 32H96a64 64 0 00-64 64v320a64 64 0 0064 64h320a64 64 0 0064-64V153.7a47.68 47.68 0 00-14.06-33.94zM120 112h176a8 8 0 018 8v48a8 8 0 01-8 8H120a8 8 0 01-8-8v-48a8 8 0 018-8zm139.75 319.91a80 80 0 1176.16-76.16 80.06 80.06 0 01-76.16 76.16z" />
                <path d="M304 352 A48 48 0 0 1 256 400 A48 48 0 0 1 208 352 A48 48 0 0 1 304 352 z" />
              </svg>
              Simpan Data
            </button>
            <button
              type="submit"
              className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-red-500 text-white hover:bg-red-600 text-sm"
              onClick={() => setDataState(null)}
            >
              <svg viewBox="0 0 1024 1024" fill="currentColor" className="w-4 h-4">
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z" />
              </svg>
              Batalkan
            </button>
          </div>
        </form>
      ) : dataState === "update" ? (
        <form className="border p-5 mb-10 bg-slate-100 relative" onSubmit={handleUpdate}>
          <div className="grid grid-cols-3 gap-3">
            <FormInput
              label="Nama Project"
              id="name"
              type="text"
              value={projectData[updateIndex].name}
            />
            <FormInput
              label="Nama Client"
              id="client"
              type="text"
              value={projectData[updateIndex].client}
            />
            <FormInput
              label="Progress"
              id="progress"
              type="text"
              value={projectData[updateIndex].progress}
            />
            <FormInput
              label="Deadline"
              id="deadline"
              type="date"
              value={projectData[updateIndex].deadline}
            />
            <FormInput
              label="Nilai"
              id="nilai"
              type="text"
              value={projectData[updateIndex].nilai}
            />
          </div>
          <div className="flex gap-2 items-center mt-7">
            <button
              type="submit"
              className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-green-500 text-white hover:bg-green-600 text-sm"
            >
              <svg viewBox="0 0 512 512" fill="currentColor" className="w-4 h-4">
                <path d="M465.94 119.76l-73.7-73.7A47.68 47.68 0 00358.3 32H96a64 64 0 00-64 64v320a64 64 0 0064 64h320a64 64 0 0064-64V153.7a47.68 47.68 0 00-14.06-33.94zM120 112h176a8 8 0 018 8v48a8 8 0 01-8 8H120a8 8 0 01-8-8v-48a8 8 0 018-8zm139.75 319.91a80 80 0 1176.16-76.16 80.06 80.06 0 01-76.16 76.16z" />
                <path d="M304 352 A48 48 0 0 1 256 400 A48 48 0 0 1 208 352 A48 48 0 0 1 304 352 z" />
              </svg>
              Perbarui Data
            </button>
            <button
              type="submit"
              className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-red-500 text-white hover:bg-red-600 text-sm"
              onClick={() => setDataState(null)}
            >
              <svg viewBox="0 0 1024 1024" fill="currentColor" className="w-4 h-4">
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z" />
              </svg>
              Batalkan
            </button>
          </div>
        </form>
      ) : null}

      <div className="flex flex-col z-30">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden  ">
              <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 ">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 ">Snape&apos;s Project</h2>
                  <p className="text-sm text-gray-600 ">Manajemen Pengerjaan Proyek</p>
                </div>
                <div>
                  <div className="inline-flex gap-x-2">
                    <button
                      className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 outline-none text-sm "
                      type="button"
                      onClick={() => setDataState("insert")}
                    >
                      <svg
                        className="w-3 h-3"
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M2.63452 7.50001L13.6345 7.5M8.13452 13V2"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                        />
                      </svg>
                      Tambah Data
                    </button>
                  </div>
                </div>
              </div>
              <table className="min-w-full divide-y divide-gray-200 relative">
                <thead className="bg-gray-50 ">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left">
                      <div className="flex items-center gap-x-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 ">
                          No
                        </span>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      <div className="flex items-center gap-x-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 ">
                          Nama
                        </span>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      <div className="flex items-center gap-x-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 ">
                          Client
                        </span>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      <div className="flex items-center gap-x-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 ">
                          Progress
                        </span>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      <div className="flex items-center gap-x-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 ">
                          Deadline
                        </span>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      <div className="flex items-center gap-x-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 ">
                          Nilai
                        </span>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-600">
                  {projectData.length === 0 && (
                    <tr>
                      <td colSpan={7} className="bg-slate-100 text-center py-5">
                        Data Kosong
                      </td>
                    </tr>
                  )}

                  {projectData.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`${
                        index === updateIndex
                          ? "bg-blue-100"
                          : index === highlightIndex
                          ? "bg-teal-100 animate-pulse"
                          : null
                      }`}
                    >
                      <td className="px-6 h-px w-px whitespace-nowrap">
                        {index + nextDataSkip + 1}
                      </td>
                      <td className="px-6 h-px w-px whitespace-nowrap">
                        <div className="pl-6 lg:pl-3 xl:pl-0 pr-6 py-3">
                          <div className="flex items-center gap-x-3">{item.name}</div>
                        </div>
                      </td>
                      <td className="h-px w-72 whitespace-nowrap">
                        <div className="px-6 py-3">{item.client}</div>
                      </td>
                      <td className="h-px w-px whitespace-nowrap">
                        <div className="px-6 py-3">{item.progress}</div>
                      </td>
                      <td className="h-px w-px whitespace-nowrap">
                        <div className="px-6 py-3">
                          <span className="text-sm text-gray-500">{item.deadline}</span>
                        </div>
                      </td>
                      <td className="h-px w-px whitespace-nowrap">
                        <div className="px-6 py-3">
                          <span className="text-sm text-gray-500">{item.nilai}</span>
                        </div>
                      </td>
                      <td className="h-px w-px whitespace-nowrap">
                        <div className="px-6 py-1.5 flex gap-3">
                          <button
                            type="button"
                            className="text-blue-500 hover:text-blue-600"
                            onClick={() => {
                              setDataState("update");
                              setUpdateIndex(index);
                            }}
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                              <path d="M6 2c-1.11 0-2 .89-2 2v16a2 2 0 002 2h4v-1.91L12.09 18H6v-2h8.09l2-2H6v-2h12.09L20 10.09V8l-6-6H6m7 1.5L18.5 9H13V3.5m7.15 9.5a.55.55 0 00-.4.16l-1.02 1.02 2.09 2.08 1.02-1.01c.21-.22.21-.58 0-.79l-1.3-1.3a.544.544 0 00-.39-.16m-2.01 1.77L12 20.92V23h2.08l6.15-6.15-2.09-2.08z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDelete(item.id!)}
                          >
                            <svg fill="currentColor" viewBox="0 0 16 16" className="w-5 h-5">
                              <path d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1H3v9a2 2 0 002 2h6a2 2 0 002-2V4h.5a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1-1H7a1 1 0 00-1 1H2.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM8 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 018 5zm3 .5v7a.5.5 0 01-1 0v-7a.5.5 0 011 0z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 ">
                <div>
                  <p className="text-sm text-gray-600 ">
                    Jumlah Data :{" "}
                    <span className="font-semibold text-gray-800 ">{projectData.length}</span>{" "}
                    Proyek
                  </p>
                </div>
                <div>
                  <div className="inline-flex gap-x-2">
                    <button
                      type="button"
                      className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm  "
                      onClick={() => getData({ prev: 3 })}
                    >
                      <svg
                        className="w-3 h-3"
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                        />
                      </svg>
                      Prev
                    </button>
                    <button
                      type="button"
                      className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm  "
                      onClick={() => getData({ next: 3 })}
                    >
                      Next
                      <svg
                        className="w-3 h-3"
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
