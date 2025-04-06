
import React, { useState, useEffect } from 'react';
import { Navbar, Alignment, Button } from '@blueprintjs/core';
import { useDispatch } from 'react-redux';
import { setDrawingMode } from '../../store/missionSlice';
import './style.scss';

const Header = () => {
  const dispatch = useDispatch();
  const [theme, setTheme] = useState('dark');

  // Effect to apply theme on component mount and when theme changes
  useEffect(() => {
    // Apply theme class to body
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
    
    // Save theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // On component mount, check saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  const handleNewMission = () => {
    dispatch(setDrawingMode(true));
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Navbar>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>Field Ops Dashboard</Navbar.Heading>
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
        <Button
          intent="minimal"
          icon={theme === 'dark' ? 'flash' : 'moon'}
          onClick={toggleTheme}
          title="Toggle Theme"
          className="theme-toggle-button"
        />
        <Button
          intent="primary"
          icon="add"
          text="Yeni Görev"
          onClick={handleNewMission}
        />
      </Navbar.Group>
    </Navbar>
  );
};

export default Header;