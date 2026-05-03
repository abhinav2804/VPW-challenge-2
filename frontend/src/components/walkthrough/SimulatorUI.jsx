import React from 'react';
import { FileCheck, Upload, User } from 'lucide-react';

export const SimulatorUI = ({ activeStep, formData, setFormData, isPhotoUploaded, setIsPhotoUploaded }) => {
  switch(activeStep) {
    case 1:
      return (
        <div className="space-y-4 max-w-xs mx-auto">
          <div className="text-left">
            <label className="text-xs font-bold text-gray-500 uppercase">Mobile Number</label>
            <input 
              type="text" 
              placeholder="98765 43210" 
              className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
              value={formData.mobile}
              onChange={(e) => setFormData({...formData, mobile: e.target.value})}
            />
          </div>
          <div className="text-left">
            <label className="text-xs font-bold text-gray-500 uppercase">Enter OTP</label>
            <div className="flex gap-2 mt-1">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="w-10 h-10 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-teal-600 font-bold">
                  {formData.otp[i-1] || ''}
                </div>
              ))}
            </div>
          </div>
          <button className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold shadow-md">Verify & Login</button>
        </div>
      );
    case 2:
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border-2 border-teal-500 bg-teal-50 dark:bg-teal-900/20 rounded-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-teal-500 text-white px-3 py-1 text-[10px] font-bold rounded-bl-xl">POPULAR</div>
            <FileCheck className="mx-auto mb-2 text-teal-600" size={32} />
            <h4 className="font-bold text-teal-900 dark:text-teal-100 text-sm">New Voter Registration</h4>
            <p className="text-[10px] text-teal-700 dark:text-teal-400 mt-1">(Form 6)</p>
          </div>
          <div className="p-4 border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-2xl text-center opacity-40 grayscale">
            <div className="w-8 h-8 mx-auto mb-2 bg-gray-200 rounded-full"></div>
            <h4 className="font-bold text-gray-400 text-sm">Shifting / Correction</h4>
            <p className="text-[10px] text-gray-400 mt-1">(Form 8)</p>
          </div>
        </div>
      );
    case 3:
      return (
        <div className="space-y-3 text-left">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">First Name</label>
              <input 
                type="text" 
                className="w-full mt-1 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm" 
                placeholder="Rahul"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">Surname</label>
              <input 
                type="text" 
                className="w-full mt-1 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm" 
                placeholder="Kumar"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase">Father/Mother Name</label>
            <input 
              type="text" 
              className="w-full mt-1 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm" 
              placeholder="Ramesh Kumar"
              value={formData.relativeName}
              onChange={(e) => setFormData({...formData, relativeName: e.target.value})}
            />
          </div>
        </div>
      );
    case 4:
      return (
        <div className="space-y-3 text-left">
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase">PIN Code</label>
            <input 
              type="text" 
              className="w-full mt-1 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-mono" 
              placeholder="110001"
              value={formData.pin}
              onChange={(e) => setFormData({...formData, pin: e.target.value})}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase">Full House Address</label>
            <textarea 
              className="w-full mt-1 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm h-20" 
              placeholder="House No 123, Sector 4..."
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            ></textarea>
          </div>
        </div>
      );
    case 5:
      return (
        <div className="space-y-4">
          <div 
            onClick={() => setIsPhotoUploaded(true)}
            className={`border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
              isPhotoUploaded 
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                : 'border-teal-200 dark:border-teal-800 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/10'
            }`}
          >
            {isPhotoUploaded ? (
              <>
                <div className="w-16 h-20 bg-gray-200 dark:bg-gray-700 rounded-md border border-green-500 flex items-center justify-center overflow-hidden">
                  <User className="text-gray-400" size={32} />
                </div>
                <p className="text-xs font-bold text-green-600">photo_final.jpg uploaded!</p>
              </>
            ) : (
              <>
                <Upload className="text-teal-600" size={32} />
                <p className="text-xs font-medium text-gray-500">Click to upload Passport Photo (Max 2MB)</p>
              </>
            )}
          </div>
          <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-xl flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase">Age Proof</span>
            <div className="w-24 h-2 bg-teal-600 rounded-full"></div>
          </div>
        </div>
      );
    case 6:
      return (
        <div className="bg-stone-50 dark:bg-gray-900 p-6 rounded-2xl border-2 border-stone-200 dark:border-gray-700 shadow-inner">
          <div className="text-[10px] font-bold text-stone-400 uppercase border-b border-stone-200 pb-2 mb-4 text-center">FORM 6 - APPLICATION FOR ENROLMENT</div>
          <div className="space-y-3 text-left">
            <div className="flex justify-between border-b border-stone-100 pb-1">
              <span className="text-[8px] font-bold text-stone-400">APPLICANT NAME:</span>
              <span className="text-[10px] font-bold text-stone-800 dark:text-stone-200">{formData.firstName || 'Rahul'} {formData.lastName || 'Kumar'}</span>
            </div>
            <div className="flex justify-between border-b border-stone-100 pb-1">
              <span className="text-[8px] font-bold text-stone-400">RELATIVE NAME:</span>
              <span className="text-[10px] font-bold text-stone-800 dark:text-stone-200">{formData.relativeName || 'Ramesh Kumar'}</span>
            </div>
            <div className="flex justify-between border-b border-stone-100 pb-1">
              <span className="text-[8px] font-bold text-stone-400">ADDRESS PIN:</span>
              <span className="text-[10px] font-bold text-stone-800 dark:text-stone-200">{formData.pin || '110001'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[8px] font-bold text-stone-400">DOCS ATTACHED:</span>
              <span className="text-[10px] font-bold text-green-600">PHOTO, AGE_PROOF, ADDR_PROOF</span>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <div className="w-12 h-12 border border-stone-200 rounded flex items-center justify-center text-[8px] text-stone-300 font-mono italic">Signature</div>
          </div>
        </div>
      );
    default:
      return null;
  }
};
