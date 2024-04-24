"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

const Dashboard = () => {
  let i = 0;
  const nama = useRef(null);
  const mkul = useRef(null);
  const nilai = useRef(null);

  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [mhs, setMhs] = useState(null);
  const [matkul, setMatkul] = useState(null);
  const [existingData, setExistingData] = useState(null);
  useEffect(() => {
    try {
      axios.get("http://127.0.0.1:8000/api/perkuliahan").then((res) => {
        setData(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  }, [refresh]);

  useEffect(() => {
    try {
      axios.get("http://127.0.0.1:8000/api/all-mahasiswa").then((res) => {
        setMhs(res.data.data);
        axios.get("http://127.0.0.1:8000/api/all-matkul").then((res) => {
          setMatkul(res.data.data);
        });
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleSumbmit = async () => {
    setError(null);

    if (
      nama.current.value == "" ||
      mkul.current.value == "" ||
      nilai.current.value == null
    ) {
      setError(true);
      return;
    }
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/perkuliahan/nilai",
        {
          nim: nama.current.value,
          kode_mk: mkul.current.value,
          nilai: nilai.current.value,
        }
      );
      if (response.data.status === 200) {
        setRefresh(!refresh);
      } else {
        Swal.fire({
          title: "Data already exist",
          text: "Use update data instade of create a new record",
          icon: "warning",
        });
      }
      document.getElementById("my_modal_3").close();

      nama.current.value = "";
      mkul.current.value = "";
      nilai.current.value = null;
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleUpdate = async () => {
    setError(null);
    if (existingData.nilai == null) {
      setError(true);
      return;
    }
    try {
      const response = await axios.put(
        "http://127.0.0.1:8000/api/perkuliahan/nilai",
        {
          nim: existingData.nim,
          kode_mk: existingData.kode,
          nilai: existingData.nilai,
        }
      );
      if (response.data.status === 200) {
        setRefresh(!refresh);
      } else {
        Swal.fire({
          title: "Data doesnt exist",
          text: "Create a new record instead",
          icon: "warning",
        });
      }
      document.getElementById("my_modal_4").close();
      setExistingData(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (nim, matkul) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Continue",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `http://127.0.0.1:8000/api/perkuliahan/nilai/${nim}/${matkul}`
          );
          Swal.fire({
            title: "Deleted!",
            text: "Nilai deleted successfully",
            icon: "success",
          });
          setRefresh(!refresh);
        } catch (error) {
          console.error("Error:", error);
        }
      }
    });
  };

  return (
    matkul && (
      <>
        <div className="mx-56">
          <h2 className="text-center text-4xl font-semibold my-16">
            Daftar Nilai Mahasiswa TRPL
          </h2>
          <button
            className="mb-8 btn btn-info text-white"
            onClick={() => document.getElementById("my_modal_3").showModal()}
          >
            Tambah Nilai
          </button>
          <dialog id="my_modal_3" className="modal">
            <div className="modal-box">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <h3 className="font-bold text-lg">Tambah Nilai</h3>
              {error && (
                <div className="badge badge-error gap-2 mt-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-4 h-4 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                  Fill all the fields
                </div>
              )}
              <label class="form-control w-full  mt-2">
                <div class="label">
                  <span class="label-text-alt">Mahasiswa</span>
                </div>
                <select
                  className="select select-bordered capitalize"
                  ref={nama}
                >
                  <option disabled selected hidden></option>
                  {mhs.map((m) => {
                    return (
                      <option className="capitalize" value={m.nim}>
                        {m.nama}
                      </option>
                    );
                  })}
                </select>
              </label>
              <label class="form-control w-full  mt-2">
                <div class="label">
                  <span class="label-text-alt">Mata Kuliah</span>
                </div>
                <select
                  className="select select-bordered capitalize"
                  required
                  ref={mkul}
                >
                  <option disabled selected hidden></option>
                  {matkul.map((m) => {
                    return (
                      <option className="capitalize" value={m.kode_mk}>
                        {m.nama_mk}
                      </option>
                    );
                  })}
                </select>
              </label>
              <label class="form-control w-full  mt-2">
                <div class="label">
                  <span class="label-text-alt">Nilai</span>
                </div>
                <input
                  ref={nilai}
                  type="number"
                  placeholder="Type here"
                  class="input input-bordered w-full"
                  max="100"
                  min="0"
                  oninput="if (this.value > 100) this.value = 100;"
                />
              </label>
              <button
                class="btn btn-info w-full  text-white mt-4"
                onClick={() => handleSumbmit()}
              >
                Submit
              </button>
            </div>
          </dialog>
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>NIM</th>
                  <th>Alamat</th>
                  <th>Tanggal Lahir</th>
                  <th>Mata Kuliah</th>
                  <th>SKS</th>
                  <th>Nilai</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, i) => {
                  i++;
                  return (
                    <tr className="" key={i}>
                      <th>{i}</th>
                      <td className="capitalize">{item.nama}</td>
                      <td>{item.nim}</td>
                      <td>{item.alamat}</td>
                      <td>{item.tanggal_lahir}</td>
                      <td className="capitalize">{item.nama_mk}</td>
                      <td>{item.sks_mk}</td>
                      <td>{item.nilai}</td>
                      <td>
                        <div className="join">
                          <button
                            className="btn join-item btn-warning"
                            onClick={() => {
                              setExistingData({
                                nim: item.nim,
                                nama: item.nama,
                                kode: item.kode_mk,
                                nama_mk: item.nama_mk,
                                nilai: item.nilai,
                              });
                              document.getElementById("my_modal_4").showModal();
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn join-item btn-error"
                            onClick={() => handleDelete(item.nim, item.kode_mk)}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <dialog id="my_modal_4" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">Edit Nilai</h3>
            {error && (
              <div className="badge badge-error gap-2 mt-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-4 h-4 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
                Fill all the fields
              </div>
            )}
            <label class="form-control w-full  mt-2">
              <div class="label">
                <span class="label-text-alt">Mahasiswa</span>
              </div>
              <select className="select select-bordered capitalize" disabled>
                <option className="capitalize" value={existingData?.nim}>
                  {existingData?.nama}
                </option>
              </select>
            </label>
            <label class="form-control w-full  mt-2">
              <div class="label">
                <span class="label-text-alt">Mata Kuliah</span>
              </div>
              <select className="select select-bordered capitalize" disabled>
                <option className="capitalize" value={existingData?.kode}>
                  {existingData?.nama_mk}
                </option>
              </select>
            </label>
            <label class="form-control w-full  mt-2">
              <div class="label">
                <span class="label-text-alt">Nilai</span>
              </div>
              <input
                type="number"
                placeholder="Type here"
                class="input input-bordered w-full"
                max="100"
                min="0"
                oninput="if (this.value > 100) this.value = 100;"
                value={existingData?.nilai}
                onChange={(e) => {
                  setExistingData({ ...existingData, nilai: e.target.value });
                }}
              />
            </label>
            <button
              class="btn btn-info w-full  text-white mt-4"
              onClick={() => handleUpdate()}
            >
              Submit
            </button>
          </div>
        </dialog>
      </>
    )
  );
};

export default Dashboard;
