import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Modal } from "react-bootstrap";
import axios from "axios";

function Jurusan() {
  const [jrs, setJrs] = useState([]);
  const [show, setShow] = useState(false);
  const [namaJurusan, setNamaJurusan] = useState("");
  const [editData, setEditData] = useState({
    id_j: null,
    nama_jurusan: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/jrs");
      const data = await response.data.data;
      setJrs(data);
    } catch (error) {
      console.error("Kesalahan: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleNamaJurusanChange = (e) => {
    setNamaJurusan(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/api/jrs/store", {
        nama_jurusan: namaJurusan,
      });
      handleClose();
      fetchData();
    } catch (error) {
      console.error("Kesalahan: ", error);
    }
  };

  const handleShowEditModal = (data) => {
    setEditData(data);
    setShowEditModal(true);
    setShow(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditData({
      id_j: null,
      nama_jurusan: "",
    });
  };

  const handleEditNamaJurusanChange = (e) => {
    setEditData((prevData) => ({
      ...prevData,
      nama_jurusan: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:3000/api/jrs/update/${editData.id_j}`, {
        nama_jurusan: editData.nama_jurusan,
      });
      handleCloseEditModal();
      fetchData();
    } catch (error) {
      console.error("Kesalahan:", error);
    }
  };

  const handleDelete = (id_j) => {
    axios
      .delete(`http://localhost:3000/api/jrs/delete/${id_j}`)
      .then((response) => {
        console.log('Data berhasil dihapus');
        const updatedJrs = jrs.filter((item) => item.id_j !== id_j);
        setJrs(updatedJrs);
      })
      .catch((error) => {
        console.error('Gagal menghapus data:', error);
        alert('Gagal menghapus data. Silakan coba lagi atau hubungi administrator.');
      });
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2>Data Jurusan</h2>
          <Button variant="primary" onClick={handleShow}>
            Tambah
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Nama Jurusan</th>
            <th scope="col" colSpan={2}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {jrs.map((jr, index) => (
            <tr key={jr.id_j}>
              <td>{index + 1}</td>
              <td>{jr.nama_jurusan}</td>
              <td>
                <button onClick={() => handleShowEditModal(jr)} className="btn btn-sm btn-info">
                  Edit
                </button>
              </td>
              <td>
                <button onClick={() => handleDelete(jr.id_j)} className="btn btn-sm btn-danger">
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Data Jurusan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nama Jurusan:</label>
              <input
                type="text"
                className="form-control"
                value={namaJurusan}
                onChange={handleNamaJurusanChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Tambah
            </button>
          </form>
        </Modal.Body>
      </Modal>
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Data Jurusan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label className="form-label">Nama Jurusan:</label>
              <input
                type="text"
                className="form-control"
                value={editData ? editData.nama_jurusan : ''}
                onChange={handleEditNamaJurusanChange}
              />
            </div>
            <Button variant="primary" onClick={handleUpdate}>
              Simpan Perubahan
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Jurusan;
