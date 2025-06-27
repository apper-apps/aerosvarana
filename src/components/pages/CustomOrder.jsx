import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomOrderForm from "@/components/organisms/CustomOrderForm";
import ApperIcon from "@/components/ApperIcon";
import React from "react";

const CustomOrder = () => {
  const navigate = useNavigate();

  const handleOrderSubmit = (orderData) => {
    // Navigate to order tracking page
    navigate(`/orders/${orderData.Id}`);
    toast.success('Custom order submitted successfully! You can track its progress now.');
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="Palette" className="w-10 h-10 text-primary" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary mb-4">
              Create Your Dream Jewelry
            </h1>
            
            <p className="text-lg text-surface-600 max-w-3xl mx-auto mb-8">
              Work with our master craftsmen to design a unique piece that tells your story. 
              From traditional Indian jewelry to contemporary designs, we'll bring your vision to life.
            </p>

            {/* Process Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
              {[
                {
                  icon: 'FileText',
                  title: 'Share Your Vision',
                  description: 'Tell us about your dream piece, upload inspiration images, and set your budget'
                },
{
                  icon: 'Users',
                  title: 'Designer Match',
                  description: 'We\'ll connect you with the perfect craftsman based on your style and requirements'
                },
                {
                  icon: 'Brush',
                  title: 'Design & Create',
                  description: 'Your designer will create sketches, get your approval, and craft your piece'
                },
                {
                  icon: 'Gift',
                  title: 'Receive & Cherish',
                  description: 'Get regular updates with photos and receive your finished masterpiece'
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <ApperIcon name={step.icon} className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-secondary mb-2">{step.title}</h3>
                  <p className="text-sm text-surface-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Form Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CustomOrderForm onSubmit={handleOrderSubmit} />
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-secondary mb-4">
              Why Choose Svarana for Custom Jewelry?
            </h2>
            <p className="text-surface-600 max-w-2xl mx-auto">
              Experience the finest craftsmanship and personalized service with our custom jewelry creation process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: 'Award',
                title: 'Master Craftsmen',
                description: 'Work with skilled artisans who have decades of experience in traditional and contemporary jewelry making.',
                color: 'primary'
              },
              {
                icon: 'Eye',
                title: 'Complete Transparency',
                description: 'Track every step of your jewelry creation with regular photo updates and milestone notifications.',
                color: 'secondary'
              },
              {
                icon: 'Shield',
                title: 'Quality Guarantee',
                description: 'Every piece comes with a lifetime authenticity guarantee and our commitment to exceptional quality.',
                color: 'success'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center p-8 rounded-xl bg-surface-50 hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-${feature.color}/10 rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <ApperIcon name={feature.icon} className={`w-8 h-8 text-${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-secondary mb-3">{feature.title}</h3>
                <p className="text-surface-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-surface-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-secondary mb-4">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                location: 'Bangalore',
                rating: 5,
                text: 'The custom necklace set for my wedding was absolutely stunning. The craftsman understood my vision perfectly and created something beyond my expectations.',
                image: 'https://images.unsplash.com/photo-1494790108755-2616b5e4d94e?w=100'
              },
              {
                name: 'Rajesh Patel',
                location: 'Mumbai',
                rating: 5,
                text: 'Excellent service and quality. The regular updates with photos made me feel involved in the entire creation process. Highly recommend Svarana.',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
              },
              {
                name: 'Kavya Reddy',
                location: 'Hyderabad',
                rating: 5,
                text: 'The temple jewelry set was crafted with such attention to detail. The traditional work is authentic and the finish is flawless.',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-secondary">{testimonial.name}</h4>
                    <p className="text-sm text-surface-500">{testimonial.location}</p>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <ApperIcon key={i} name="Star" className="w-4 h-4 text-warning fill-current" />
                  ))}
                </div>
                
                <p className="text-surface-700 leading-relaxed">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomOrder;