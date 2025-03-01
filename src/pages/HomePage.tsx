import React from 'react';
import { Link } from 'react-router-dom';
import { Kanban, CheckSquare, Users, Clock, Layout } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-r from-sky-700 to-sky-500 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Taskify helps teams move work forward.
                </h1>
                <p className="text-xl mb-6">
                  Collaborate, manage projects, and reach new productivity peaks. From high rises to the home office, the way your team works is unique—accomplish it all with Taskify.
                </p>
                <Link to="/register">
                  <Button size="lg">
                    Sign up - it's free!
                  </Button>
                </Link>
              </div>
              
              <div className="md:w-1/2 md:pl-8">
                <img
                  src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                  alt="Taskify board visualization"
                  className="rounded-lg shadow-xl w-full"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Features to help your team succeed
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-sky-600 mb-4">
                  <Layout size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Intuitive Boards</h3>
                <p className="text-gray-600">
                  Organize your projects into boards, lists, and cards. Drag and drop to prioritize tasks.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-sky-600 mb-4">
                  <CheckSquare size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Task Management</h3>
                <p className="text-gray-600">
                  Create tasks, add descriptions, attach files, and track progress all in one place.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-sky-600 mb-4">
                  <Users size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
                <p className="text-gray-600">
                  Invite team members, assign tasks, and collaborate in real-time on your projects.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-sky-600 mb-4">
                  <Clock size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Workflow Automation</h3>
                <p className="text-gray-600">
                  Automate repetitive tasks and streamline your workflow to save time.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="py-16 bg-sky-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to get started with Taskify?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of users and start organizing your projects today. Sign up for free and experience the power of Taskify.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/register">
                <Button size="lg">
                  Sign up for free
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">
                  Log in
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;