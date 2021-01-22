import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { createLogEntry } from './API';

const LogEntryForm = ({ location, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      data.latitude = location.latitude;
      data.longitude = location.longitude;
      await createLogEntry(data);
      onClose();
    } catch (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="entry-form">
        {error ? <h3>{error}</h3> : null}
        <label htmlFor="apiKey">API KEY</label>
        <input type="password" name="apiKey" required ref={register}/>
        <label htmlFor="title">Title</label>
        <input name="title" required ref={register}/>
        <label htmlFor="comments">Comments</label>
        <textarea name="comments" rows={3} ref={register}></textarea>
        <label htmlFor="image">Image</label>
        <input name="image" ref={register}/>
        <label htmlFor="visitDate">Visit Date</label>
        <input name="visitDate" type="date" ref={register}/>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button disabled={loading}>{loading ? 'Loading...' : 'Create Log Entry!'}</button>
    </form>
  );
};

export default LogEntryForm;