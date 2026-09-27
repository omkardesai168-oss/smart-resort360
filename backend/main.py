"""
Resort 360 FastAPI Backend
Staff Directory API
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json

app = FastAPI(title="Resort 360 API", version="1.0.0")

# Allow Next.js frontend on port 3000/3001
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# In-memory Staff Directory Data
# ---------------------------------------------------------------------------

STAFF_DIRECTORY = [
    # ELECTRICIANS
    {"id": "EL-001", "name": "Rajesh Kumar", "department": "Electrical", "role": "Electrician", "skill": "Electrician", "shift": "Morning", "status": "ON_DUTY", "phone": "+91-9810001001", "email": "rajesh.kumar@azurehills.com", "zone": "Main Building", "experience": "8 years", "certifications": ["Wireman License", "HV Safety"], "availability": "Available"},
    {"id": "EL-002", "name": "Suresh Pillai", "department": "Electrical", "role": "Senior Electrician", "skill": "Electrician", "shift": "Night", "status": "ON_DUTY", "phone": "+91-9810001002", "email": "suresh.pillai@azurehills.com", "zone": "Pool & Spa Wing", "experience": "12 years", "certifications": ["Master Electrician", "Fire Safety"], "availability": "Busy"},
    {"id": "EL-003", "name": "Manoj Sharma", "department": "Electrical", "role": "Electrician", "skill": "Electrician", "shift": "Afternoon", "status": "BREAK", "phone": "+91-9810001003", "email": "manoj.sharma@azurehills.com", "zone": "East Wing", "experience": "5 years", "certifications": ["Wireman License"], "availability": "On Break"},

    # PLUMBERS
    {"id": "PL-001", "name": "Vikram Nair", "department": "Plumbing", "role": "Plumber", "skill": "Plumber", "shift": "Morning", "status": "ON_DUTY", "phone": "+91-9810002001", "email": "vikram.nair@azurehills.com", "zone": "West Wing", "experience": "10 years", "certifications": ["Licensed Plumber", "Sanitation"], "availability": "Available"},
    {"id": "PL-002", "name": "Deepak Rao", "department": "Plumbing", "role": "Senior Plumber", "skill": "Plumber", "shift": "Morning", "status": "ON_DUTY", "phone": "+91-9810002002", "email": "deepak.rao@azurehills.com", "zone": "Main Building", "experience": "15 years", "certifications": ["Licensed Plumber", "Backflow Prevention"], "availability": "Available"},
    {"id": "PL-003", "name": "Anil Verma", "department": "Plumbing", "role": "Plumber", "skill": "Plumber", "shift": "Night", "status": "OFF_DUTY", "phone": "+91-9810002003", "email": "anil.verma@azurehills.com", "zone": "North Tower", "experience": "6 years", "certifications": ["Licensed Plumber"], "availability": "Off Duty"},

    # HVAC TECHNICIANS
    {"id": "HV-001", "name": "Pradeep Menon", "department": "HVAC", "role": "HVAC Technician", "skill": "HVAC Technician", "shift": "Morning", "status": "ON_DUTY", "phone": "+91-9810003001", "email": "pradeep.menon@azurehills.com", "zone": "All Wings", "experience": "9 years", "certifications": ["HVAC-R License", "EPA 608"], "availability": "Available"},
    {"id": "HV-002", "name": "Santhosh Iyer", "department": "HVAC", "role": "HVAC Engineer", "skill": "HVAC Technician", "shift": "Afternoon", "status": "ON_DUTY", "phone": "+91-9810003002", "email": "santhosh.iyer@azurehills.com", "zone": "Banquet Hall", "experience": "11 years", "certifications": ["HVAC-R License", "Building Automation"], "availability": "Busy"},

    # HOUSEKEEPING
    {"id": "HK-001", "name": "Meera Singh", "department": "Housekeeping", "role": "Senior Housekeeper", "skill": "Housekeeping", "shift": "Morning", "status": "ON_DUTY", "phone": "+91-9810004001", "email": "meera.singh@azurehills.com", "zone": "Villa 01-06", "experience": "7 years", "certifications": ["Hospitality Excellence"], "availability": "Busy"},
    {"id": "HK-002", "name": "Kiran Bose", "department": "Housekeeping", "role": "Housekeeper", "skill": "Housekeeping", "shift": "Morning", "status": "ON_DUTY", "phone": "+91-9810004002", "email": "kiran.bose@azurehills.com", "zone": "East Wing Rooms", "experience": "4 years", "certifications": ["Hospitality Excellence"], "availability": "Available"},
    {"id": "HK-003", "name": "Anita Dubey", "department": "Housekeeping", "role": "Housekeeper", "skill": "Housekeeping", "shift": "Afternoon", "status": "ON_DUTY", "phone": "+91-9810004003", "email": "anita.dubey@azurehills.com", "zone": "West Wing Rooms", "experience": "3 years", "certifications": [], "availability": "Available"},
    {"id": "HK-004", "name": "Priya Patel", "department": "Housekeeping", "role": "Laundry Specialist", "skill": "Housekeeping", "shift": "Morning", "status": "ON_DUTY", "phone": "+91-9810004004", "email": "priya.patel@azurehills.com", "zone": "Laundry Bay", "experience": "5 years", "certifications": ["Linen Care Certificate"], "availability": "Busy"},

    # MAINTENANCE
    {"id": "MT-001", "name": "Arjun Das", "department": "Maintenance", "role": "Maintenance Technician", "skill": "General Maintenance", "shift": "Morning", "status": "ON_DUTY", "phone": "+91-9810005001", "email": "arjun.das@azurehills.com", "zone": "All Zones", "experience": "8 years", "certifications": ["OSHA Safety", "Equipment Handling"], "availability": "Busy"},
    {"id": "MT-002", "name": "Ravi Teja", "department": "Maintenance", "role": "Maintenance Engineer", "skill": "General Maintenance", "shift": "Night", "status": "ON_DUTY", "phone": "+91-9810005002", "email": "ravi.teja@azurehills.com", "zone": "Pool & Fitness", "experience": "10 years", "certifications": ["OSHA Safety", "Pool Maintenance"], "availability": "Available"},

    # CONCIERGE
    {"id": "CO-001", "name": "Nalini Krishnan", "department": "Concierge", "role": "Head Concierge", "skill": "Concierge", "shift": "Morning", "status": "ON_DUTY", "phone": "+91-9810006001", "email": "nalini.krishnan@azurehills.com", "zone": "Front Desk", "experience": "12 years", "certifications": ["Les Clefs d'Or", "Hospitality Mgmt"], "availability": "Available"},
    {"id": "CO-002", "name": "Rohit Saxena", "department": "Concierge", "role": "Concierge", "skill": "Concierge", "shift": "Afternoon", "status": "ON_DUTY", "phone": "+91-9810006002", "email": "rohit.saxena@azurehills.com", "zone": "Front Desk", "experience": "5 years", "certifications": ["Hospitality Mgmt"], "availability": "Available"},

    # SECURITY
    {"id": "SC-001", "name": "Harpreet Singh", "department": "Security", "role": "Head of Security", "skill": "Security", "shift": "Night", "status": "ON_DUTY", "phone": "+91-9810007001", "email": "harpreet.singh@azurehills.com", "zone": "Main Gate & Perimeter", "experience": "15 years", "certifications": ["CCTV Operator", "First Aid", "Fire Safety"], "availability": "On Duty"},
    {"id": "SC-002", "name": "Sunil Thakur", "department": "Security", "role": "Security Guard", "skill": "Security", "shift": "Morning", "status": "ON_DUTY", "phone": "+91-9810007002", "email": "sunil.thakur@azurehills.com", "zone": "Lobby & Entrance", "experience": "4 years", "certifications": ["First Aid"], "availability": "On Duty"},

    # FOOD & BEVERAGE
    {"id": "FB-001", "name": "Chef Raman Gupta", "department": "Food & Beverage", "role": "Executive Chef", "skill": "Chef", "shift": "Morning", "status": "ON_DUTY", "phone": "+91-9810008001", "email": "raman.gupta@azurehills.com", "zone": "Main Kitchen", "experience": "18 years", "certifications": ["Culinary Arts", "Food Safety Level 4"], "availability": "Busy"},
    {"id": "FB-002", "name": "Lakshmi Venkat", "department": "Food & Beverage", "role": "Sous Chef", "skill": "Chef", "shift": "Morning", "status": "ON_DUTY", "phone": "+91-9810008002", "email": "lakshmi.venkat@azurehills.com", "zone": "Main Kitchen", "experience": "10 years", "certifications": ["Culinary Arts", "Food Safety Level 3"], "availability": "Busy"},
    {"id": "FB-003", "name": "Dinesh Kapoor", "department": "Food & Beverage", "role": "Waiter", "skill": "F&B Service", "shift": "Afternoon", "status": "ON_DUTY", "phone": "+91-9810008003", "email": "dinesh.kapoor@azurehills.com", "zone": "Restaurant & Bar", "experience": "4 years", "certifications": ["Sommelier Basics"], "availability": "Available"},

    # SPA & WELLNESS
    {"id": "SP-001", "name": "Dr. Kavitha Nair", "department": "Spa", "role": "Spa Director", "skill": "Therapist", "shift": "Morning", "status": "ON_DUTY", "phone": "+91-9810009001", "email": "kavitha.nair@azurehills.com", "zone": "Spa & Wellness Centre", "experience": "14 years", "certifications": ["CIBTAC", "Ayurveda Practitioner"], "availability": "Busy"},
    {"id": "SP-002", "name": "Pooja Shetty", "department": "Spa", "role": "Massage Therapist", "skill": "Therapist", "shift": "Afternoon", "status": "ON_DUTY", "phone": "+91-9810009002", "email": "pooja.shetty@azurehills.com", "zone": "Spa & Wellness Centre", "experience": "6 years", "certifications": ["CIBTAC", "Aromatherapy"], "availability": "Available"},

    # FRONT DESK
    {"id": "FD-001", "name": "Neha Joshi", "department": "Front Desk", "role": "Front Office Manager", "skill": "Front Desk", "shift": "Morning", "status": "ON_DUTY", "phone": "+91-9810010001", "email": "neha.joshi@azurehills.com", "zone": "Front Desk", "experience": "9 years", "certifications": ["Hospitality Mgmt", "CRM Systems"], "availability": "Available"},
    {"id": "FD-002", "name": "Karthik Rajan", "department": "Front Desk", "role": "Receptionist", "skill": "Front Desk", "shift": "Night", "status": "ON_DUTY", "phone": "+91-9810010002", "email": "karthik.rajan@azurehills.com", "zone": "Front Desk", "experience": "3 years", "certifications": ["Hospitality Mgmt"], "availability": "Available"},

    # GARDENING & GROUNDS
    {"id": "GD-001", "name": "Balu Krishnamurthy", "department": "Grounds", "role": "Head Gardener", "skill": "Gardener", "shift": "Morning", "status": "ON_DUTY", "phone": "+91-9810011001", "email": "balu.krishnamurthy@azurehills.com", "zone": "All Outdoor Areas", "experience": "20 years", "certifications": ["Horticulture Diploma"], "availability": "Available"},
    {"id": "GD-002", "name": "Selvan Muthu", "department": "Grounds", "role": "Groundskeeper", "skill": "Gardener", "shift": "Morning", "status": "ON_DUTY", "phone": "+91-9810011002", "email": "selvan.muthu@azurehills.com", "zone": "Pool & Garden", "experience": "8 years", "certifications": [], "availability": "Available"},

    # IT & AV
    {"id": "IT-001", "name": "Siddharth Mehta", "department": "IT", "role": "IT Manager", "skill": "IT Support", "shift": "Morning", "status": "ON_DUTY", "phone": "+91-9810012001", "email": "siddharth.mehta@azurehills.com", "zone": "Server Room & All", "experience": "11 years", "certifications": ["CompTIA Network+", "CCNA", "AWS Cloud"], "availability": "Available"},
    {"id": "IT-002", "name": "Aisha Baig", "department": "IT", "role": "AV Technician", "skill": "IT Support", "shift": "Afternoon", "status": "ON_DUTY", "phone": "+91-9810012002", "email": "aisha.baig@azurehills.com", "zone": "Banquet & Conference", "experience": "5 years", "certifications": ["AV Technology", "Crestron Certified"], "availability": "Available"},
]

# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------

class StaffMember(BaseModel):
    id: str
    name: str
    department: str
    role: str
    skill: str
    shift: str
    status: str
    phone: str
    email: str
    zone: str
    experience: str
    certifications: List[str]
    availability: str

class StaffUpdateStatus(BaseModel):
    status: str
    availability: str

# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/")
def root():
    return {"message": "Resort 360 FastAPI Backend", "version": "1.0.0"}

@app.get("/api/staff/directory", response_model=List[StaffMember])
def get_staff_directory(
    department: Optional[str] = Query(None, description="Filter by department"),
    skill: Optional[str] = Query(None, description="Filter by skill"),
    status: Optional[str] = Query(None, description="Filter by status"),
    search: Optional[str] = Query(None, description="Search by name"),
):
    """Get the full staff directory with optional filters."""
    results = STAFF_DIRECTORY

    if department:
        results = [s for s in results if s["department"].lower() == department.lower()]
    if skill:
        results = [s for s in results if s["skill"].lower() == skill.lower()]
    if status:
        results = [s for s in results if s["status"].lower() == status.lower()]
    if search:
        q = search.lower()
        results = [s for s in results if q in s["name"].lower() or q in s["role"].lower() or q in s["department"].lower()]

    return results

@app.get("/api/staff/directory/{staff_id}", response_model=StaffMember)
def get_staff_member(staff_id: str):
    """Get a single staff member by ID."""
    member = next((s for s in STAFF_DIRECTORY if s["id"] == staff_id), None)
    if not member:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return member

@app.get("/api/staff/departments")
def get_departments():
    """Get all unique departments and their staff counts."""
    depts = {}
    for s in STAFF_DIRECTORY:
        dept = s["department"]
        if dept not in depts:
            depts[dept] = {"name": dept, "count": 0, "onDuty": 0}
        depts[dept]["count"] += 1
        if s["status"] == "ON_DUTY":
            depts[dept]["onDuty"] += 1
    return list(depts.values())

@app.get("/api/staff/skills")
def get_skills():
    """Get all unique skills."""
    skills = list(set(s["skill"] for s in STAFF_DIRECTORY))
    return sorted(skills)

@app.put("/api/staff/directory/{staff_id}/status")
def update_staff_status(staff_id: str, update: StaffUpdateStatus):
    """Update a staff member's status."""
    for i, s in enumerate(STAFF_DIRECTORY):
        if s["id"] == staff_id:
            STAFF_DIRECTORY[i]["status"] = update.status
            STAFF_DIRECTORY[i]["availability"] = update.availability
            return {"message": "Status updated", "staff": STAFF_DIRECTORY[i]}
    raise HTTPException(status_code=404, detail="Staff member not found")
