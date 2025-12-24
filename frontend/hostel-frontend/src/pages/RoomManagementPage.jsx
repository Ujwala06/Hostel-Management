import { useEffect, useState } from 'react';
import axios from 'axios';
import TopBar from '../components/TopBar.jsx';
import SiteFooter from '../components/SiteFooter.jsx';

const RoomManagementPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filterFloor, setFilterFloor] = useState('');
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);

  const [selectedRoomNo, setSelectedRoomNo] = useState(null);
  const [selectedRoomDetail, setSelectedRoomDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [roomForm, setRoomForm] = useState({
    roomNo: '',
    floor: '',
    capacity: '',
    roomType: 'Single',
  });
  const [editingRoomNo, setEditingRoomNo] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const loadRooms = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {};
      if (filterFloor) params.floor = filterFloor;
      if (filterAvailableOnly) params.available = 'true';

      const res = await axios.get('/api/rooms', { params });
      setRooms(res.data || []);
    } catch (err) {
      setError('Failed to load rooms.');
    } finally {
      setLoading(false);
    }
  };

  const loadRoomDetail = async (roomNo) => {
    setDetailLoading(true);
    setSelectedRoomDetail(null);
    try {
      const res = await axios.get(`/api/rooms/${roomNo}`);
      setSelectedRoomDetail(res.data);
    } catch (err) {
      // detail errors are non-fatal for page
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterFloor, filterAvailableOnly]);

  const handleSelectRoom = (roomNo) => {
    setSelectedRoomNo(roomNo);
    if (roomNo) {
      loadRoomDetail(roomNo);
      setEditingRoomNo(roomNo);
      const room = rooms.find((r) => r.roomNo === roomNo);
      if (room) {
        setRoomForm({
          roomNo: room.roomNo,
          floor: room.floor,
          capacity: room.capacity,
          roomType: room.roomType,
        });
      }
    } else {
      setSelectedRoomDetail(null);
      setEditingRoomNo(null);
      setRoomForm({ roomNo: '', floor: '', capacity: '', roomType: 'Single' });
    }
  };

  const handleRoomFormChange = (e) => {
    const { name, value } = e.target;
    setRoomForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoomFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setError('');

    try {
      const payload = {
        roomNo: Number(roomForm.roomNo),
        floor: Number(roomForm.floor),
        capacity: Number(roomForm.capacity),
        roomType: roomForm.roomType,
      };

      if (!editingRoomNo) {
        // Create new room
        const res = await axios.post('/api/rooms', payload);
        setRooms((prev) => [...prev, res.data].sort((a, b) => a.roomNo - b.roomNo));
        setRoomForm({ roomNo: '', floor: '', capacity: '', roomType: 'Single' });
      } else {
        // Update existing room (except roomNo, which is the identifier)
        const { roomNo, ...updatePayload } = payload;
        const res = await axios.patch(`/api/rooms/${editingRoomNo}`, updatePayload);
        setRooms((prev) => prev.map((r) => (r.roomNo === editingRoomNo ? res.data : r)));
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save room.';
      setError(message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteRoom = async (roomNo) => {
    // eslint-disable-next-line no-alert
    const confirmDelete = window.confirm('Are you sure you want to delete this room?');
    if (!confirmDelete) return;

    setError('');
    try {
      await axios.delete(`/api/rooms/${roomNo}`);
      setRooms((prev) => prev.filter((r) => r.roomNo !== roomNo));
      if (selectedRoomNo === roomNo) {
        handleSelectRoom(null);
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete room.';
      setError(message);
    }
  };

  const handleNewRoomClick = () => {
    setEditingRoomNo(null);
    setSelectedRoomNo(null);
    setSelectedRoomDetail(null);
    setRoomForm({ roomNo: '', floor: '', capacity: '', roomType: 'Single' });
  };

  const availableCount = rooms.filter((r) => r.currentOccupancy < r.capacity).length;

  return (
    <div>
      <TopBar />
      <main className="page">
        <h1>Room Management</h1>
        {error && <div className="alert alert--error">{error}</div>}

        {loading ? (
          <p>Loading rooms...</p>
        ) : (
          <div className="grid grid--two-cols">
            {/* Left: rooms list & filters */}
            <section className="card">
              <div className="card__header">
                <h2>Rooms ({rooms.length})</h2>
                <span className="text-muted">
                  Available: {availableCount}
                </span>
              </div>

              <form className="form form--inline" onSubmit={(e) => e.preventDefault()}>
                <div className="form__group">
                  <label htmlFor="filter-floor">Floor</label>
                  <input
                    id="filter-floor"
                    type="number"
                    value={filterFloor}
                    onChange={(e) => setFilterFloor(e.target.value)}
                    placeholder="All"
                  />
                </div>
                <div className="form__group">
                  <label htmlFor="filter-available">
                    <input
                      id="filter-available"
                      type="checkbox"
                      checked={filterAvailableOnly}
                      onChange={(e) => setFilterAvailableOnly(e.target.checked)}
                    />{' '}
                    Only available
                  </label>
                </div>
              </form>

              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Room No</th>
                      <th>Floor</th>
                      <th>Type</th>
                      <th>Occupancy</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.length === 0 && (
                      <tr>
                        <td colSpan={5}>No rooms found.</td>
                      </tr>
                    )}
                    {rooms.map((room) => {
                      const isAvailable = room.currentOccupancy < room.capacity;
                      return (
                        <tr key={room._id || room.roomNo}>
                          <td>{room.roomNo}</td>
                          <td>{room.floor}</td>
                          <td>{room.roomType}</td>
                          <td>
                            {room.currentOccupancy} / {room.capacity}{' '}
                            {isAvailable && <span className="badge">Available</span>}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn--secondary"
                              onClick={() => handleSelectRoom(room.roomNo)}
                            >
                              Details / Edit
                            </button>{' '}
                            <button
                              type="button"
                              className="btn btn--danger"
                              onClick={() => handleDeleteRoom(room.roomNo)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Right: create / edit + room detail */}
            <section className="card">
              <div className="card__header">
                <h2>{editingRoomNo ? `Edit Room ${editingRoomNo}` : 'Create New Room'}</h2>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={handleNewRoomClick}
                >
                  + New Room
                </button>
              </div>

              <form className="form" onSubmit={handleRoomFormSubmit}>
                <div className="form__group">
                  <label htmlFor="roomNo">Room Number</label>
                  <input
                    id="roomNo"
                    name="roomNo"
                    type="number"
                    value={roomForm.roomNo}
                    onChange={handleRoomFormChange}
                    required
                    disabled={!!editingRoomNo}
                  />
                </div>
                <div className="form__group">
                  <label htmlFor="floor">Floor</label>
                  <input
                    id="floor"
                    name="floor"
                    type="number"
                    value={roomForm.floor}
                    onChange={handleRoomFormChange}
                    required
                  />
                </div>
                <div className="form__group">
                  <label htmlFor="capacity">Capacity</label>
                  <input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min={1}
                    value={roomForm.capacity}
                    onChange={handleRoomFormChange}
                    required
                  />
                </div>
                <div className="form__group">
                  <label htmlFor="roomType">Room Type</label>
                  <select
                    id="roomType"
                    name="roomType"
                    value={roomForm.roomType}
                    onChange={handleRoomFormChange}
                  >
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Triple">Triple</option>
                    <option value="Dorm">Dorm</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn--primary btn--block"
                  disabled={formSubmitting}
                >
                  {formSubmitting
                    ? editingRoomNo
                      ? 'Saving...'
                      : 'Creating...'
                    : editingRoomNo
                    ? 'Save Changes'
                    : 'Create Room'}
                </button>
              </form>

              <hr style={{ margin: '1.25rem 0' }} />

              <h3>Room Details & Students</h3>
              {!selectedRoomNo && <p>Select a room from the list to view details.</p>}
              {selectedRoomNo && detailLoading && <p>Loading room details...</p>}
              {selectedRoomNo && !detailLoading && selectedRoomDetail && (
                <div>
                  <p>
                    <strong>Room:</strong> {selectedRoomDetail.roomNo} |{' '}
                    <strong>Floor:</strong> {selectedRoomDetail.floor} |{' '}
                    <strong>Type:</strong> {selectedRoomDetail.roomType}
                  </p>
                  <p>
                    <strong>Capacity:</strong> {selectedRoomDetail.currentOccupancy} /{' '}
                    {selectedRoomDetail.capacity}
                  </p>

                  <h4>Students in this room</h4>
                  {selectedRoomDetail.students?.length === 0 && <p>No students assigned.</p>}
                  {selectedRoomDetail.students?.length > 0 && (
                    <ul className="list list--compact">
                      {selectedRoomDetail.students.map((s) => (
                        <li key={s._id} className="list__item">
                          <strong>{s.name}</strong> – {s.email} (Phone {s.phone})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};

export default RoomManagementPage;
